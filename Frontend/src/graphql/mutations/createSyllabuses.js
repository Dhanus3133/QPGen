import { gql } from "@apollo/client";

export const createSyllabusesMutation = gql`
  mutation CreateSyllabuses($course: Int!, $units: [Int!]!, $lessons: [Int!]!) {
    createSyllabuses(course: $course, units: $units, lessons: $lessons)
  }
`;
