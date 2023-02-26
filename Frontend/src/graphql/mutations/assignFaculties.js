import { gql } from "@apollo/client";

export const assignFacultiesMutation = gql`
  mutation AssignFaculties($course: Int!, $subject: Int!, $faculties: [Int!]!) {
    assignFaculties(course: $course, subject: $subject, faculties: $faculties)
  }
`;
