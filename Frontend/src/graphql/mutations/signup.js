import { gql } from "@apollo/client";

export const signupMutation = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createNewUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    )
  }
`;
