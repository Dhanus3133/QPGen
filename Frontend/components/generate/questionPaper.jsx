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
  semester,
  total,
  time,
  exam,
  dateTime,
  set,
}) => {
  const { data, loading, error } = useQuery(generateQuestionsQuery, {
    variables: { course, lids, marks, counts, choices },
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
        className="print:hidden"
        onClick={() => {
          setIsAnswer(!isAnswer);
          console.log(isAnswer);
        }}
      >
        {isAnswer ? "Question Paper" : "Answer Paper"}
      </Button>

      <QuestionPaperGen
        data={generatedData["questions"]}
        isAnswer={isAnswer}
        options={generatedData["options"]}
        semester={semester}
        total={total}
        time={time}
        exam={exam}
        dateTime={dateTime}
        set={set}
      />
      <Analytics
        co={generatedData["analytics"]["co"]}
        btl={generatedData["analytics"]["btl"]}
      />
    </>
  );
};

export default QuestionPaper;
