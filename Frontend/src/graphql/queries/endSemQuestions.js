import { gql } from "@apollo/client";

export const endSemQuestionsQuery = gql`
  query EndSemQuestions($subject: String!) {
    endSemQuestions(subject: $subject) {
      id
      part
      number
      roman
      option
      mark
      question
      answer
    }
  }
`;
