import { gql } from "@apollo/client";

export const regulationsQuery = gql`
  query Regulations {
    regulations {
      id
      year
    }
  }
`;
