import { gql } from "@apollo/client";

export const bloomsTaxonomiesQuery = gql`
  query BloomsTaxonomies {
    bloomsTaxonomyLevels {
      id
      name
      description
    }
  }
`;
