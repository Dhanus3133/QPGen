import { gql } from "@apollo/client";

export const updateQuestionMutation = gql`
  mutation UpdateQuestion(
    $id: ID!
    $question: String!
    $answer: String
    $mark: ID!
    $btl: ID!
    $difficulty: DifficultyEnum!
    $updatedBy: ID!
    $topics: [ID!]
    $previousYears: [ID!]
    $priority: Int
    $scenarioBased: Boolean
  ) {
    updateQuestion(
      data: {
        id: $id
        question: $question
        answer: $answer
        mark: { set: $mark }
        btl: { set: $btl }
        difficulty: $difficulty
        updatedBy: { set: $updatedBy }
        topics: { set: $topics }
        previousYears: { set: $previousYears }
        priority: $priority
        scenarioBased: $scenarioBased
      }
    ) {
      ... on QuestionType {
        id
        question
        answer
        difficulty
        mark {
          id
          start
          end
        }
        btl {
          id
          name
        }
        topics {
          id
          name
        }
        createdBy {
          fullName
          email
        }
        updatedBy {
          fullName
          email
        }
        previousYears {
          id
          month
          year
        }
        priority
        scenarioBased
        createdAt
        updatedAt
      }
    }
  }
`;
