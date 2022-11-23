import { gql } from "@apollo/client";

// query GetCourses($lessons: [Int!]!) {
//   getCourses(lessons: $lessons) {
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
