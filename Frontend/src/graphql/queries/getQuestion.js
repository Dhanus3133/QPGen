import { gql } from "@apollo/client";

export const getQuestionQuery = gql`
  query getQuestion($id: GlobalID!) {
    question(id: $id) {
      id
      question
      answer
      difficulty
      mark {
        start
        end
      }
      btl {
        name
      }
      createdBy {
        email
      }
      previousYears {
        month
        year
      }
      createdAt
      updatedAt
    }
  }
`;
