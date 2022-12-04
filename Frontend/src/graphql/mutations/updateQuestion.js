import { gql } from "@apollo/client";

export const updateQuestionMutation = gql`
  mutation UpdateQuestion(
    $id: GlobalID!
    $question: String!
    $answer: String
    $mark: GlobalID!
    $btl: GlobalID!
    $difficulty: DifficultyEnum!
    $topics: [NodeInputPartial!]
    $previousYears: [NodeInputPartial!]
  ) {
    updateQuestion(
      input: {
        id: $id
        question: $question
        answer: $answer
        mark: { id: $mark }
        btl: { id: $btl }
        difficulty: $difficulty
        topics: { set: $topics }
        previousYears: { set: $previousYears }
      }
    ) {
      ... on QuestionType {
        id
        question
      }
    }
  }
`;
