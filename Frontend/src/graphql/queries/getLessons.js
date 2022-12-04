import { gql } from "@apollo/client";

export const getLessonsQuery = gql`
  query GetLessons(
    $regulation: Int!
    $programme: String!
    $degree: String!
    $semester: Int!
    $department: String!
    $subjectCode: String!
  ) {
    getLessons(
      regulation: $regulation
      programme: $programme
      degree: $degree
      semester: $semester
      department: $department
      subjectCode: $subjectCode
    ) {
      id
      unit
      lesson {
        id
        name
      }
    }
  }
`;
