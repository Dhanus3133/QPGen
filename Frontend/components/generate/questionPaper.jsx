import { generateQuestionsQuery } from "@/src/graphql/queries/generateQuestions";
import { romanize } from "@/src/utils";
import { useQuery } from "@apollo/client";
import Analytics from "./qp/analytics";
import QuestionPaperGen from "./qp/questioncomp";

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

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const generatedData = JSON.parse(data["generateQuestions"]);
  console.log(generatedData);
  return (
    <>
      <QuestionPaperGen
        data={generatedData["questions"]}
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
