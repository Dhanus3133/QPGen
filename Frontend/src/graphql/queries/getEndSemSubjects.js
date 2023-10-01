import { gql } from "@apollo/client";

export const getEndSemSubjectsQuery = gql`
  query GetEndSemSubjects {
    getEndSemSubjects {
      id
      semester
      marks
      counts
      choices
      subject {
        id
        code
        subjectName
      }
    }
  }
`;
