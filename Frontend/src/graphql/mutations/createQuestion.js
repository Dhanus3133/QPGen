import { gql } from "@apollo/client";

export const createQuestionMutation = gql`
  mutation CreateQuestion(
    $lesson: GlobalID!
    $question: String!
    $answer: String
    $mark: GlobalID!
    $btl: GlobalID!
    $difficulty: DifficultyEnum!
    $createdBy: GlobalID!
    $topics: [NodeInputPartial!]
    $previousYears: [NodeInputPartial!]
    $priority: Int!
    $scenarioBased: Boolean!
  ) {
    createQuestion(
      input: {
        lesson: { id: $lesson }
        question: $question
        answer: $answer
        mark: { id: $mark }
        btl: { id: $btl }
        difficulty: $difficulty
        createdBy: { id: $createdBy }
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
