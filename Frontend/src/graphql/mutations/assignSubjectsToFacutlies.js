import { gql } from "@apollo/client";

export const assignSubjectToFacultiesMutation = gql`
  mutation AssignSubjectToFaculties($faculties: [Int!]!) {
    assignSubjectToFaculties(faculties: $faculties)
  }
`;
