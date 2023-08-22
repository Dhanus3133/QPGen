import { gql } from "@apollo/client";

export const createQuestionMutation = gql`
  mutation CreateQuestion(
    $lesson: ID!
    $question: String!
    $answer: String
    $mark: ID!
    $btl: ID!
    $difficulty: DifficultyEnum!
    $createdBy: ID!
    $topics: [ID!]
    $previousYears: [ID!]
    $priority: Int
    $scenarioBased: Boolean
  ) {
    createQuestion(
      data: {
        lesson: $lesson
        question: $question
        answer: $answer
        mark: { set: $mark }
        btl: { set: $btl }
        difficulty: $difficulty
        createdBy: { set: $createdBy }
        topics: { set: $topics }
        previousYears: { set: $previousYears }
        priority: $priority
        scenarioBased: $scenarioBased
      }
    ) {
      ... on QuestionType {
        id
        question
        mark {
          start
          end
        }
      }
    }
  }
`;
