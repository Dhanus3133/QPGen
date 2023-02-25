import { gql } from "@apollo/client";

export const getLessonsBySubjectIdQuery = gql`
  query GetLessonsBySubjectId($subjectId: Int!) {
    getLessonsBySubjectId(subjectId: $subjectId) {
      id
      name
    }
  }
`;
