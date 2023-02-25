import { gql } from "@apollo/client";

export const validateCreateSubjectTokenQuery = gql`
  query ValidateCreateSubjectToken($token: String!) {
    validateCreateSubjectToken(token: $token)
  }
`;
