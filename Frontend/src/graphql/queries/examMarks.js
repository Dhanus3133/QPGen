import { gql } from "@apollo/client";

export const examMarksQuery = gql`
  query ExamMarks {
    examMarks {
      id
      label
      exam {
        id
        name
      }
      total
      marks
      counts
      choices
      units
      time
    }
  }
`;
