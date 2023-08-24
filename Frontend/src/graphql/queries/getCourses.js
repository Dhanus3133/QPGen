import { gql } from "@apollo/client";

export const getCoursesQuery = gql`
  query GetCourses {
    getCourses {
      id
      semester
      department {
        branchCode
        programme {
          name
        }
        degree {
          name
        }
      }
      regulation {
        year
      }
    }
  }
`;
