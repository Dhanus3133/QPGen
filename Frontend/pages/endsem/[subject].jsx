import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { endSemQuestionsQuery } from "@/src/graphql/queries/endSemQuestions";

export default function EndSemQuestions() {
  const router = useRouter();
  const { subject } = router.query;
  const [parts, setParts] = useState([]);
  console.log(subject);
  const { data, loading, error } = useQuery(endSemQuestionsQuery, {
    variables: {
      subject: subject,
    },
  });

  // useEffect(() => {
  //   const q = data?.endSemQuestions;
  //   if (data) {
  //     questions[String.fromCharCode(q.part + 64)] = q;
  //   }
  // }, [data]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (data) {
      const q = data?.endSemQuestions;
      setQuestions(q);
      // const organizedQuestions = [];
      //
      // q.forEach((question) => {
      //   const { part, roman, option } = question;
      // });
      //
      // console.log(organizedQuestions);
    }
  }, [data]);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  const getRoman = {
    1: "i",
    2: "ii",
    3: "iii",
  };

  console.log(questions);
  // console.log(parts);

  return questions?.map((question, idx) => (
    <div key={question.id}>
      <p>
        {String.fromCharCode(question.part + 64)} {question.number}
        {". "}
        {question.part === 1 ? `${getRoman[question.roman]}) ` : ""}
        {question.part !== 1 ? `${getRoman[question.roman]}) ` : ""}
      </p>
    </div>
  ));

  // return data?.endSemQuestions?.map((question) => (
  //   <div key={question.id}>
  //     <p>
  //       {String.fromCharCode(question.part + 64)} {question.number}{" "}
  //       {getRoman[question.roman]} {question.question}
  //     </p>
  //   </div>
  // ));
}
