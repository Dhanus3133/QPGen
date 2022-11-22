import { gql } from "@apollo/client";

export const isAuthorizedQuery = gql`
  query isAuthorized {
    isAuthorized
  }
`;
