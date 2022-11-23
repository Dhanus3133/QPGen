import { gql } from "@apollo/client";

export const getSubjectsByIdQuery = gql`
  query GetSubjectsById($courseId: Int!) {
    getSubjectsById(courseId: $courseId) {
      id
      code
      subjectName
    }
  }
`;
