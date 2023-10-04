import { gql } from "@apollo/client";

export const generateQuestionsQuery = gql`
  query generateQuestions(
    $course: Int!
    $lids: [Int!]!
    $marks: [Int!]!
    $counts: [Int!]!
    $choices: [Boolean!]!
    $exam: Int!
    $saveAnalysis: Boolean!
    $useAi: Boolean!
  ) {
    generateQuestions(
      course: $course
      lids: $lids
      marks: $marks
      counts: $counts
      choices: $choices
      exam: $exam
      saveAnalysis: $saveAnalysis
      useAi: $useAi
    )
  }
`;
