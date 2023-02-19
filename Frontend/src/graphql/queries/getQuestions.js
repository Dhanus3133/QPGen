import { gql } from "@apollo/client";

export const getQuestionsQuery = gql`
  query GetLessons(
    $regulation: Int!
    $programme: String!
    $degree: String!
    $semester: Int!
    $department: String!
    $subjectCode: String!
    $unit: Int!
    $search: String!
    $first: Int
    $after: String
  ) {
    getQuestions(
      regulation: $regulation
      programme: $programme
      degree: $degree
      semester: $semester
      department: $department
      subjectCode: $subjectCode
      unit: $unit
      search: $search
      first: $first
      after: $after
    ) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          question
          mark {
            start
            end
          }
        }
      }
    }
  }
`;
