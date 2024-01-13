import { generateQuestionsQuery } from "@/src/graphql/queries/generateQuestions";
import { useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox, TextField } from "@mui/material";
import Analytics from "./qp/analytics";
import QuestionPaperGen from "./qp/questioncomp";
import { useState } from "react";
import ShowIdsInDialog from "./qp/showIds";

const QuestionPaper = ({
  course,
  lids,
  marks,
  counts,
  choices,
  examID,
  saveAnalysis,
  useAi,
  avoidQuestionIds,
  isRetest,
  semester,
  total,
  setTotal,
  time,
  exam,
  isSem,
  isGate,
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
      avoidQuestionIds,
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
      <ShowIdsInDialog
        title={"Selected Question ID's"}
        ids={JSON.stringify(generatedData["options"]["choosenQuestionIds"])}
        className="no-print"
      />
      <div>
        {isGate && (
          <TextField
            id="total-marks"
            key="total"
            label="Total Marks"
            type="number"
            variant="outlined"
            value={total}
            InputProps={{
              inputProps: { min: 1 },
            }}
            onChange={(e) => {
              const val = e.target.value;
              setTotal(val ? parseInt(val) : null);
            }}
          />
        )}
      </div>
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
        isGate={isGate}
      />
      {!isSem && (
        <Analytics
          co={generatedData["analytics"]["co"]}
          btl={generatedData["analytics"]["btl"]}
        />
      )}
    </>
  );
};

export default QuestionPaper;
