import {gql} from "@apollo/client";

export const allUsersQuery = gql`
  query Users {
    users {
      id
      email
      firstName
      lastName
    }
  }
`;
