import { useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";
import { generateQuestionsGateQuery } from "@/src/graphql/queries/generateQuestionsGate";
import QuestionPaperGen from "../qp/questioncomp";
import ShowIdsInDialog from "../qp/showIds";

const QuestionPaper = ({
  course,
  subjects,
  lids,
  marks,
  counts,
  choices,
  examID,
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
  const { data, loading, error } = useQuery(generateQuestionsGateQuery, {
    variables: {
      course,
      lids,
      marks,
      counts,
      choices,
      exam: examID,
      useAi,
      avoidQuestionIds,
    },
  });

  const [isAnswer, setIsAnswer] = useState(false);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const generatedData = JSON.parse(data["generateQuestionsGate"]);
  console.log(generatedData);
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
            className="no-print"
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
    </>
  );
};

export default QuestionPaper;
