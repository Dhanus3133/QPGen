import { gql } from "@apollo/client";

export const logoutMutation = gql`
  mutation Logout {
    deleteTokenCookie {
      deleted
    }
  }
`;
