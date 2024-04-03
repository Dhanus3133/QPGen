import { gql } from "@apollo/client";

export const createEndSemQuestionMutation = gql`
  mutation CreateEndSemQuestion(
    $subject: ID!
    $part: Int!
    $number: Int!
    $roman: Int!
    $option: Int!
    $co: Int!
    $btl: Int!
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
