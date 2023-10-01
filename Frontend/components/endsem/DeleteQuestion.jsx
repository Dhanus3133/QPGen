import { AiFillDelete } from "react-icons/ai";
import Button from "@mui/material/Button";
import { deleteEndSemQuestionMutation } from "@/src/graphql/mutations/deleteEndSemQuestion";
import { useMutation } from "@apollo/client";
import { endSemQuestionsQuery } from "@/src/graphql/queries/endSemQuestions";

export default function DeleteQuestion({ question, subjectCode }) {
  const [deleteEndSemQuestion, {}] = useMutation(deleteEndSemQuestionMutation, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: endSemQuestionsQuery,
        variables: {
          subject: subjectCode,
        },
      },
    ],
  });
  return (
    <>
      <Button
        onClick={() => {
          deleteEndSemQuestion({
            variables: {
              id: parseInt(question),
            },
          });
        }}
        color="error"
      >
        <AiFillDelete />
      </Button>
    </>
  );
}
