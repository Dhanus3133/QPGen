import { gql } from "@apollo/client";

export const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on UserType {
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
