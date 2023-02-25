import { gql } from "@apollo/client";

export const allFacultiesQuery = gql`
  query Faculties {
    faculties {
      id
      email
      fullName
    }
  }
`;
