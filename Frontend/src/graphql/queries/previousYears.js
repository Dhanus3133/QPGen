import { gql } from "@apollo/client";

export const previousYearsQuery = gql`
  query PreviousYears {
    previousYears {
      id
      month
      year
    }
  }
`;
