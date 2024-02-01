import { gql } from "@apollo/client";

export const getLessonsByCourseSubjectIdQuery = gql`
  query GetLessonsByCourseSubjectId($courseId: Int!, $subjectId: Int!) {
    getLessonsByCourseSubjectId(courseId: $courseId, subjectId: $subjectId) {
      unit
      lesson {
        id
        name
      }
    }
  }
`;
