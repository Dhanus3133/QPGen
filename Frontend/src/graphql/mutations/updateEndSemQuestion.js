import { gql } from "@apollo/client";
export const updateEndSemQuestionMutation = gql`
  mutation UpdateEndSemQuestion(
    $id: ID!
    $option: Int
    $co: Int!
    $btl: Int!
    $question: String!
    $answer: String
    $mark: Int
  ) {
    updateEndSemQuestion(
      data: {
        id: $id
        option: $option
        co: $co
        btl: $btl
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
