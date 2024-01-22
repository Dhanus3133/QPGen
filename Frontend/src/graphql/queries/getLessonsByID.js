import { gql } from "@apollo/client";

export const getLessonsByIdQuery = gql`
  query GetLessonsById($subjectId: Int!) {
    getLessonsById(subjectId: $subjectId) {
      unit
      lesson {
        id
        name
      }
    }
  }
`;
