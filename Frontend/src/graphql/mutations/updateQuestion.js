import { gql } from "@apollo/client";

export const updateQuestionMutation = gql`
  mutation UpdateQuestion(
    $id: GlobalID!
    $lesson: GlobalID!
    $question: String!
    $answer: String
    $mark: GlobalID!
    $btl: GlobalID!
    $difficulty: DifficultyEnum!
    $topics: [NodeInputPartial!]
    $previousYears: [NodeInputPartial!]
    $priority: Int!
    $scenarioBased: Boolean!
  ) {
    updateQuestion(
      input: {
        id: $id
        lesson: { id: $lesson }
        question: $question
        answer: $answer
        mark: { id: $mark }
        btl: { id: $btl }
        difficulty: $difficulty
        topics: { set: $topics }
        previousYears: { set: $previousYears }
        priority: $priority
        scenarioBased: $scenarioBased
      }
    ) {
      ... on QuestionType {
        id
        question
      }
    }
  }
`;
