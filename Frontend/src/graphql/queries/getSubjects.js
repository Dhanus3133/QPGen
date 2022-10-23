import { gql } from "@apollo/client";

export const getSubjectsQuery = gql`
  query GetSubjects(
    $regulation: Int!
    $programme: String!
    $degree: String!
    $semester: Int!
    $department: String!
  ) {
    getSubjects(
      regulation: $regulation
      programme: $programme
      degree: $degree
      semester: $semester
      department: $department
    ) {
      subject {
        id
        subjectName
        code
      }
    }
  }
`;
