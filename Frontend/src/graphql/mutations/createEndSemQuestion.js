import { gql } from "@apollo/client";

export const createEndSemQuestionMutation = gql`
  mutation CreateEndSemQuestion(
    $subject: ID!
    $part: Int!
    $number: Int!
    $roman: Int!
    $option: Int!
    $question: String!
    $answer: String
    $mark: Int!
  ) {
    createEndSemQuestion(
      data: {
        subject: $subject
        part: $part
        number: $number
        roman: $roman
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
