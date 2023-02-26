import { gql } from "@apollo/client";

export const createSubjectMutation = gql`
  mutation CreateSubject($code: String!, $subjectName: String!, $co: String!) {
    createSubject(input: { code: $code, subjectName: $subjectName, co: $co }) {
      ... on SubjectType {
        id
        subjectName
        code
        co
      }
      ... on OperationInfo {
        messages {
          message
        }
      }
    }
  }
`;
