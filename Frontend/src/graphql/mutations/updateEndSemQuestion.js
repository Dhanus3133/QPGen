import { gql } from "@apollo/client";
export const updateEndSemQuestionMutation = gql`
  mutation UpdateEndSemQuestion(
    $id: ID!
    $option: Int
    $question: String!
    $answer: String
    $mark: Int
  ) {
    updateEndSemQuestion(
      data: {
        id: $id
        option: $option
        question: $question
        answer: $answer
        mark: $mark
      }
    ) {
      ... on EndSemQuestionType {
        id
      }
      ... on OperationInfo {
        messages {
          field
          kind
          message
        }
      }
    }
  }
`;
