import { gql } from "@apollo/client";

export const endSemQuestionsQuery = gql`
  query EndSemQuestions($subject: String!) {
    endSemQuestions(subject: $subject) {
      id
      part
      number
      roman
      option
      btl {
        id
        name
      }
      co
      mark
      question
      answer
    }
  }
`;
