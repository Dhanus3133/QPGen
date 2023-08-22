import { gql } from "@apollo/client";

export const getQuestionQuery = gql`
  query getQuestion($id: ID!) {
    question(pk: $id) {
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
        fullName
        email
      }
      updatedBy {
        fullName
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
