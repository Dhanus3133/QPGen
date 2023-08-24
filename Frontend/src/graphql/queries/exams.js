import { gql } from "@apollo/client";

export const examsQuery = gql`
  query Exams {
    exams {
      id
      label
      name
      total
      marks
      counts
      choices
      units
      time
    }
  }
`;
