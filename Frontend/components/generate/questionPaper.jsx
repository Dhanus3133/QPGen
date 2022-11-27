import { generateQuestionsQuery } from "@/src/graphql/queries/generateQuestions";
import { romanize } from "@/src/utils";
import { useQuery } from "@apollo/client";
import QuestionPaperGen from "./qp/questioncomp";

const QuestionPaper = ({
  lids,
  marks,
  counts,
  choices,
  semester,
  total,
  time,
}) => {
  const { data, loading, error } = useQuery(generateQuestionsQuery, {
    variables: { lids, marks, counts, choices },
  });

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const generatedData = JSON.parse(data["generateQuestions"]);

  let courseObjective = {
    1: {
      cono: 1,
      text: "To understand the basics of algorithmic notion",
    },
    2: {
      cono: 2,
      text: "To understand and apply the algorithm analysis techniques.",
    },
    3: {
      cono: 3,
      text: "To critically analyze the efficiency of alternative algorithmic solutions for the same",
    },
    4: {
      cono: 4,
      text: "To understand different algorithm design techniques.",
    },
    5: {
      cono: 5,
      text: "	To understand the limitations of Algorithmic power.",
    },
  };
  let courseOutcomes = {
    1: {
      cono: "C123.1",
      text: "To understand the basics of algorithmic notion",
    },
    2: {
      cono: "C123.2",
      text: "To understand and apply the algorithm analysis techniques.",
    },
    3: {
      cono: "C123.3",
      text: "To critically analyze the efficiency of alternative algorithmic solutions for the same",
    },
    4: {
      cono: "C123.4",
      text: "To understand different algorithm design techniques.",
    },
    5: {
      cono: "C123.5",
      text: "	To understand the limitations of Algorithmic power.",
    },
  };

  return (
    <>
      <QuestionPaperGen
        data={generatedData["questions"]}
        options={generatedData["options"]}
        cObj={courseObjective}
        cOut={courseOutcomes}
        semester={semester}
        total={total}
        time={time}
      />
    </>
  );
};

export default QuestionPaper;
