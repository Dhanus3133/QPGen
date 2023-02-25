import { gql } from "@apollo/client";

export const getAllSubjectsQuery = gql`
  query GetAllSubjects {
    getAllSubjects {
      id
      subjectName
      code
    }
  }
`;
