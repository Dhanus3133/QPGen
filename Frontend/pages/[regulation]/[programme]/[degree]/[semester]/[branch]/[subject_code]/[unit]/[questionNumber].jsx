import { getQuestionQuery } from "@/src/graphql/queries/getQuestion";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import CustomVditor from "components/vditor";
import style from "styles/Question.module.css";

export default function EditQuestion() {
  const router = useRouter();
  const { questionNumber } = router.query;

  const [vQuestion, vSetQuestion] = useState(null);
  const [vAnswer, vSetAnswer] = useState(null);
  const globalID = btoa(`QuestionType:${questionNumber}`);

  const { data, loading, error } = useQuery(getQuestionQuery, {
    ssr: false,
    skip: !router.isReady,
    variables: {
      id: globalID,
    },
  });

  if (!router.isReady || loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  const question = data?.question;

  return (
    <>
      <h1>Quesion ID - {questionNumber}</h1>
      <br />
      <div>
        <CustomVditor
          id="question"
          value={question["question"]}
          vd={vQuestion}
          setVd={vSetQuestion}
        />
      </div>
      <br />
      <div>
        <CustomVditor
          id="answer"
          value={question["answer"]}
          vd={vAnswer}
          setVd={vSetAnswer}
        />
      </div>
      <br />
      <div className={`mx-auto w-1/3 ${style.bgcolor} py-5 px-5 rounded-xl`}>
        <p className="py-2">Difficultly Level - {question["difficulty"]}</p>
        <div className={`${style.line} w-full bg-slate-500 mx-auto`}></div>
        <p className="py-2">
          Mark Range - {question["mark"]["start"]} to {question["mark"]["end"]}
        </p>
        <div className={`${style.line} w-full bg-slate-500 mx-auto`}></div>
        <p className="py-2">{question["btl"]["name"]}</p>
        <div className={`${style.line} w-full bg-slate-500 mx-auto`}></div>
        <p className="py-2">Created By - {question["createdBy"]["email"]}</p>
        <div className={`${style.line} w-full bg-slate-500 mx-auto`}></div>
        <p className="py-2">Created At - {question["createdAt"]}</p>
        <div className={`${style.line} w-full bg-slate-500 mx-auto`}></div>
        <p className="py-2">Updated At - {question["updatedAt"]}</p>
      </div>
    </>
  );
}
