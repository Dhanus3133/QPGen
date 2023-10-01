import { gql } from "@apollo/client";

export const deleteEndSemQuestionMutation = gql`
  mutation DeleteEndSemQuestion($id: Int!) {
    deleteEndSemQuestion(input: { id: $id }) {
      ... on OperationInfo {
        messages {
          field
          kind
          message
        }
      }
    }
  }
`;
