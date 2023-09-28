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

  const [questionParts, setQuestionParts] = useState({});

  // {
  //   1: [ // Total Question
  //     [ // one Questions whole thing (Option 1)
  //       [ // Roman
  //         {},
  //         {}
  //       ],
  //       [
  //         /// Option 2
  //       ]
  //     ]
  //   ]
  //  }

  useEffect(() => {
    if (data) {
      const q = data?.endSemQuestions;
      setQuestions(q);

      const alreadySeenQuestionNumbers = [];
      let currIndex = 0;

      q.map((question) => {
        const { part, roman, option, number } = question;
        if (questionParts[part]) {
          if (!alreadySeenQuestionNumbers.includes(number)) {
            if (option === 1) {
              questionParts[part][number - 1] = [];
              let len = questionParts[part][number - 1].length;
              questionParts[part][number - 1].push([question]);
              currIndex = len;
            } else if (option === 2) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 3) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 4) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === null) {
              currIndex = 0;
              questionParts[part][number - 1] = [];
              questionParts[part][number - 1].push([question]);
            }
          } else {
            if (option === 2) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 3) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 4) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === null) {
              currIndex = 0;
              questionParts[part][number - 1].push([question]);
            }
          }
          alreadySeenQuestionNumbers.push(number);
        } else {
          questionParts[part] = [];
          if (!alreadySeenQuestionNumbers.includes(number)) {
            questionParts[part][number - 1] = [];
            if (option === 1) {
              questionParts[part][number - 1] = [];
              let len = questionParts[part][number - 1].length;
              questionParts[part][number - 1].push([question]);
              currIndex = len;
            } else if (option === 2) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 3) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 4) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === null) {
              currIndex = 0;
              questionParts[part][number - 1] = [];
              questionParts[part][number - 1].push([question]);
            }
          } else {
            if (option === 2) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 3) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === 4) {
              questionParts[part][number - 1][currIndex].push(question);
            } else if (option === null) {
              currIndex = 0;
              questionParts[part][number - 1].push([question]);
            }
          }
          alreadySeenQuestionNumbers.push(number);
        }
      });

      const cleanedaQuestionParts = {};
      Object.keys(questionParts).forEach((part) => {
        cleanedaQuestionParts[part] = [];
        questionParts[part].forEach((question) => {
          cleanedaQuestionParts[part].push(question);
        });
      });

      console.log("QUESIONPARTS", questionParts);
      console.log("CLEANED", cleanedaQuestionParts);
      setQuestionParts(cleanedaQuestionParts);
    }
  }, [data]);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  const getRoman = {
    1: "i",
    2: "ii",
    3: "iii",
  };

  const getPart = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
  };

  console.log(questions);
  // console.log(parts);

  // return questions?.map((question, idx) => (
  //   <div key={question.id} className="w-full justify-center">
  //     {/* <p> */}
  //     {/* {String.fromCharCode(question.part + 64)} {question.number} */}
  //     {". "}
  //     {/* {question.part === 1 ? `${getRoman[question.roman]}) ` : ""} */}
  //     {/* {question.part !== 1 ? `${getRoman[question.roman]}) ` : ""} */}
  //     {/* </p> */}

  //     {/* Part A Questions */}
  //     <div>
  //       <p></p>
  //     </div>
  //   </div>
  // ));

  return (
    <div className="p-8">
      {Object.keys(questionParts).map((part) => (
        <div className="w-full bg-white text-black p-4">
          <p className=" text-center font-bold text-2xl">
            Part {getPart[part]}
          </p>
          {/* <div>
            {questionParts[part].map((question) => {
              console.log("Ques", question)
              return (
                <div className="w-full">
                  <p className="text-xl font-bold">
                    {question[0][0].number}. {question[0].question}
                  </p>
                </div>
              );
            })}
          </div> */}
        </div>
      ))}
    </div>
  );

  // return data?.endSemQuestions?.map((question) => (
  //   <div key={question.id}>
  //     <p>
  //       {String.fromCharCode(question.part + 64)} {question.number}{" "}
  //       {getRoman[question.roman]} {question.question}
  //     </p>
  //   </div>
  // ));
}
