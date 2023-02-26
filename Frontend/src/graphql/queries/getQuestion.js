import { gql } from "@apollo/client";

export const getQuestionQuery = gql`
  query getQuestion($id: GlobalID!) {
    question(id: $id) {
      id
      question
      answer
      difficulty
      mark {
        id
        start
        end
      }
      btl {
        id
        name
      }
      topics {
        id
        name
      }
      createdBy {
        email
      }
      previousYears {
        id
        month
        year
      }
      priority
      scenarioBased
      createdAt
      updatedAt
    }
  }
`;
