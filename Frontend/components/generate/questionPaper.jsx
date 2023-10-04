import { generateQuestionsQuery } from "@/src/graphql/queries/generateQuestions";
import { useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import Analytics from "./qp/analytics";
import QuestionPaperGen from "./qp/questioncomp";
import { useState } from "react";

const QuestionPaper = ({
  course,
  lids,
  marks,
  counts,
  choices,
  examID,
  saveAnalysis,
  useAi,
  isRetest,
  semester,
  total,
  time,
  exam,
  isSem,
  dateTime,
  set,
}) => {
  const { data, loading, error } = useQuery(generateQuestionsQuery, {
    variables: {
      course,
      lids,
      marks,
      counts,
      choices,
      saveAnalysis,
      useAi,
      exam: examID,
    },
  });

  const [isAnswer, setIsAnswer] = useState(false);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const generatedData = JSON.parse(data["generateQuestions"]);
  return (
    <>
      <Button
        variant="outlined"
        color={"success"}
        className="no-print"
        onClick={() => {
          setIsAnswer(!isAnswer);
        }}
      >
        {isAnswer ? "Question Paper" : "Answer Paper"}
      </Button>
      <Button
        variant="outlined"
        color={"success"}
        className="no-print"
        onClick={() => {
          document.title =
            `${isAnswer ? "AK" : "QP"} - ` +
            generatedData["options"]["subjectCode"] +
            ` ${generatedData["options"]["subjectName"]} - ` +
            exam +
            `${
              dateTime
                ? ` - ${dateTime.format("DD")}-${dateTime.format("MM")}-${
                    dateTime.format("YYYY") % 100
                  }`
                : ""
            }`;
          window.print();
        }}
      >
        Print
      </Button>

      <QuestionPaperGen
        data={generatedData["questions"]}
        isAnswer={isAnswer}
        isSem={isSem}
        options={generatedData["options"]}
        semester={semester}
        total={total}
        time={time}
        exam={exam}
        dateTime={dateTime}
        set={set}
        isRetest={isRetest}
      />
      <Analytics
        co={generatedData["analytics"]["co"]}
        btl={generatedData["analytics"]["btl"]}
      />
    </>
  );
};

export default QuestionPaper;
