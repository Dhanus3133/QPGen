import { gql } from "@apollo/client";

export const generateQuestionsQuery = gql`
  query generateQuestions(
    $lids: [Int!]!
    $marks: [Int!]!
    $counts: [Int!]!
    $choices: [Boolean!]!
  ) {
    generateQuestions(
      lids: $lids
      marks: $marks
      counts: $counts
      choices: $choices
    )
  }
`;
