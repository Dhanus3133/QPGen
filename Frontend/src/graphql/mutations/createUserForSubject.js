import { gql } from "@apollo/client";

export const createEndSemSubjectMutation = gql`
  mutation CreateEndSemSubject(
    $subject: Int!
    $password: String!
    $marks: [Int!]!
    $counts: [Int!]!
    $choices: [Boolean!]!
  ) {
    createEndSemSubject(
      input: {
        subject: $subject
        password: $password
        marks: $marks
        counts: $counts
        choices: $choices
      }
    ) {
      ... on UserType {
        id
        email
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
