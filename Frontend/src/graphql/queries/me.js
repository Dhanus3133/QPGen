import { gql } from "@apollo/client";

export const meQuery = gql`
  query MeQuery {
    me {
      id
    }
  }
`;
