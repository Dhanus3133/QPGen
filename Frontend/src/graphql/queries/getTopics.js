import { gql } from "@apollo/client";

export const getTopicsQuery = gql`
  query GetTopics(
    $regulation: Int!
    $programme: String!
    $degree: String!
    $semester: Int!
    $department: String!
    $subjectCode: String!
    $unit: Int!
  ) {
    getTopics(
      regulation: $regulation
      programme: $programme
      degree: $degree
      semester: $semester
      department: $department
      subjectCode: $subjectCode
      unit: $unit
    ) {
      id
      name
      active
    }
  }
`;
