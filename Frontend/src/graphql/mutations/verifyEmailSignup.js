import { gql } from "@apollo/client";

export const verifyEmailSignupMutation = gql`
  mutation VerifyEmailSignup($token: String!) {
    verifyEmailSignup(token: $token)
  }
`;
