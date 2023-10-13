import { gql } from "@apollo/client";

export const GenerateEndSemQuestionsQuery = gql`
  query generateEndSemQuestions($subject: String!) {
    generateEndSemQuestions(subject: $subject)
  }
`;
