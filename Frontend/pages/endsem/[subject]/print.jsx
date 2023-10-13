import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GenerateEndSemQuestionsQuery } from "@/src/graphql/queries/generateEndSemQuestions";
import QuestionPaperGen from "@/components/generate/qp/questioncomp";

export default function Print() {
  const router = useRouter();
  const { subject } = router.query;

  const { data, loading, error } = useQuery(GenerateEndSemQuestionsQuery, {
    variables: {
      subject: subject,
    },
    skip: !subject,
  });

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  if (!data?.generateEndSemQuestions) return <h2>Not Found</h2>;

  const generatedData = JSON.parse(data?.generateEndSemQuestions);
  console.log(generatedData["questions"]);
  // return <h2>Hello</h2>;

  return (
    <>
      <QuestionPaperGen
        data={generatedData["questions"]}
        isAnswer={false}
        isSem={true}
        options={generatedData["options"]}
        semester={generatedData["options"]["semester"]}
        total={"100"}
        time={"Three"}
        exam={"NOV / DEC 2023"}
        dateTime={""}
        set={""}
        isRetest={false}
      />
    </>
  );
}
