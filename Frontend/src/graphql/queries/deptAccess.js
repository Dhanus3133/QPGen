import { gql } from "@apollo/client";

export const departmentsAccessToQuery = gql`
  query DepartmentsAccessTo {
    departmentsAccessTo {
      course {
        id
        semester
        department {
          degree {
            name
            fullForm
          }
          programme {
            name
          }
          branchCode
        }
        regulation {
          year
        }
      }
    }
  }
`;
