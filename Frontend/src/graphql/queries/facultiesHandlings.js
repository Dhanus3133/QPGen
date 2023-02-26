import { gql } from "@apollo/client";

export const FacultiesHandlingsQuery = gql`
  query FacultiesHandlings($course: Int!, $subject: Int!) {
    facultiesHandlings(course: $course, subject: $subject) {
      faculties {
        id
        email
        fullName
      }
    }
  }
`;
