import { gql } from "@apollo/client";

export const generateQuestionsGateQuery = gql`
  query generateQuestionsGate(
    $course: Int!
    $lids: [[Int!]!]!
    $marks: [[Int!]!]!
    $counts: [[Int!]!]!
    $choices: [[Boolean!]!]!
    $exam: Int!
    $useAi: Boolean!
    $avoidQuestionIds: [Int!]!
  ) {
    generateQuestionsGate(
      course: $course
      lids: $lids
      marks: $marks
      counts: $counts
      choices: $choices
      exam: $exam
      useAi: $useAi
      avoidQuestionIds: $avoidQuestionIds
    )
  }
`;

