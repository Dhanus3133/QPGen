import { gql } from "@apollo/client";

export const createTopicMutation = gql`
  mutation CreateTopic(
    $lesson: Int!
    $name: String!
    $regulation: Int!
    $programme: String!
    $degree: String!
    $semester: Int!
    $department: String!
    $subjectCode: String!
    $unit: Int!
  ) {
    createTopic(
      input: {
        lesson: $lesson
        name: $name
        regulation: $regulation
        programme: $programme
        degree: $degree
        semester: $semester
        department: $department
        subjectCode: $subjectCode
        unit: $unit
      }
    ) {
      ... on TopicType {
        id
        name
      }
    }
  }
`;
