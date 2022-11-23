import { gql } from "@apollo/client";

export const getLessonsByIdQuery = gql`
  query GetLessonsById($courseId: Int!, $subjectId: Int!) {
    getLessonsById(courseId: $courseId, subjectId: $subjectId) {
      id
      name
    }
  }
`;
