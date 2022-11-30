import { getQuestionQuery } from "@/src/graphql/queries/getQuestion";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomVditor from "components/vditor";
import style from "styles/Question.module.css";
import MarkRanges from "components/question/MarkRanges";
import BloomsTaxonomies from "components/question/BloomsTaxonomies";
import Difficulty from "components/question/Difficulty";
import Topics from "components/question/Topics";
import PreviousYears from "components/question/PreviousYears";

export default function EditQuestion() {
  const router = useRouter();
  const { questionNumber } = router.query;

  const [vQuestion, vSetQuestion] = useState(null);
  const [vAnswer, vSetAnswer] = useState(null);
  const [markRange, setMarkRange] = useState(null);
  const [btl, setBtl] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [topics, setTopics] = useState([]);
  const [previousYears, setPreviousYears] = useState([]);
  const globalID = btoa(`QuestionType:${questionNumber}`);

  const { data, loading, error } = useQuery(getQuestionQuery, {
    skip: !router.isReady,
    variables: {
      id: globalID,
    },
  });

  useEffect(() => {
    setMarkRange(data?.question["mark"]["id"]);
    setBtl(data?.question["btl"]["id"]);
    setDifficulty(data?.question.difficulty);
    setTopics(data?.question.topics);
    setPreviousYears(data?.question.previousYears);
  }, [data]);

  if (!router.isReady || loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  const question = data?.question;

  return (
    <>
      <h1>Quesion ID - {questionNumber}</h1>
      <br />
      Question:
      <CustomVditor
        id="question"
        value={question["question"]}
        vd={vQuestion}
        setVd={vSetQuestion}
      />
      Answer:
      <CustomVditor
        id="answer"
        value={question["answer"]}
        vd={vAnswer}
        setVd={vSetAnswer}
      />
      <div className="">
        Mark Range:{" "}
        <MarkRanges markRange={markRange} setMarkRange={setMarkRange} />
      </div>
      <div className="">
        Blooms Taxonomy Level: <BloomsTaxonomies btl={btl} setBtl={setBtl} />
      </div>
      <div className="">
        Difficulty:{" "}
        <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
      </div>
      <div className="">
        Topics: <Topics router={router} topics={topics} setTopics={setTopics} />
      </div>
      <div className="">
        Previous Years:{" "}
        <PreviousYears
          previousYears={previousYears}
          setPreviousYears={setPreviousYears}
        />
      </div>
    </>
  );
}
