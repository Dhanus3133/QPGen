import { gql } from "@apollo/client";

export const markRangesQuery = gql`
  query MarkRanges {
    markRanges {
      id
      start
      end
    }
  }
`;
