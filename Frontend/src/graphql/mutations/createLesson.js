import { gql } from "@apollo/client";

export const createLessonMutation = gql`
  mutation CreateLesson(
    $subject: Int!
    $name: String!
    $objective: String!
    $outcome: String!
    $outcomeBtl: [Int!]!
  ) {
    createLesson(
      input: {
        subject: $subject
        name: $name
        objective: $objective
        outcome: $outcome
        outcomeBtl: $outcomeBtl
      }
    ) {
      ... on LessonType {
        id
        name
        objective
        outcome
      }
      ... on OperationInfo {
        __typename
        messages {
          message
        }
      }
    }
  }
`;
