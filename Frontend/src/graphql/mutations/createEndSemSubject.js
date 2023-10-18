import { gql } from "@apollo/client";

export const createEndSemSubjectMutation = gql`
  mutation CreateEndSemSubject(
    $regulation: Int!
    $semester: Int!
    $subject: Int!
    $password: String!
    $marks: [Int!]!
    $counts: [Int!]!
    $choices: [Boolean!]!
    $isInternal: Boolean!
    $isExternal: Boolean!
  ) {
    createEndSemSubject(
      input: {
        regulation: $regulation
        semester: $semester
        subject: $subject
        password: $password
        marks: $marks
        counts: $counts
        choices: $choices
        isInternal: $isInternal
        isExternal: $isExternal
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
