import { getQuestionQuery } from "@/src/graphql/queries/getQuestion";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Script from "next/script";
import CustomVditor from "components/vditor";
import "vditor/dist/index.css";
// import "vditor/dist/index";
// import "vditor/dist/js/i18n/en_US.min.js";
import "vditor/dist/method.min.js";
import Vditor from "vditor";

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
      <CustomVditor
        id="question"
        value={question["question"]}
        vd={vQuestion}
        setVd={vSetQuestion}
      />
      <br />
      <CustomVditor
        id="answer"
        value={question["answer"]}
        vd={vAnswer}
        setVd={vSetAnswer}
      />
      <br />
      <p>Difficultly Level - {question["difficulty"]}</p>
      <br />
      <p>
        Mark Range - {question["mark"]["start"]} to {question["mark"]["end"]}
      </p>
      <br />
      <p>{question["btl"]["name"]}</p>
      <br />
      <p>Created By - {question["createdBy"]["email"]}</p>
      <br />
      <p>Created At - {question["createdAt"]}</p>

      <br />
      <p>Updated At - {question["updatedAt"]}</p>
      <div
        dangerouslySetInnerHTML={{
          __html: `<div class="vditor-reset" id="preview"><p><code>Vditor</code> is awesome!<span class="language-math">\\utilde{AB}</span></div>`,
        }}
      ></div>
    </>
  );
}
// <Script src="https://unpkg.com/vditor@3.8.17/dist/method.min.js" />;
