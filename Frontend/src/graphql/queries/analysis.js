import { gql } from "@apollo/client";

export const analysisQuery = gql`
  query Analysis($exam: Int!) {
    analysis(exam: $exam) {
      id
      analysisBtl {
        analysis {
          analysisBtl {
            btl {
              name
            }
            percentage
          }
          courses {
            id
            department {
              id
              degree {
                name
                id
              }
              programme {
                name
                id
              }
              branchCode
              branch
            }
            regulation {
              year
            }
            semester
          }
          subject {
            id
            code
            subjectName
          }
        }
      }
    }
  }
`;
