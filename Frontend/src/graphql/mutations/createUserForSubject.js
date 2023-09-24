import { gql } from "@apollo/client";

export const createUserForSubjectMutation = gql`
  mutation createUserForSubject($subject: Int!, $password: String!) {
    createUserForSubject(input: { subject: $subject, password: $password }) {
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
