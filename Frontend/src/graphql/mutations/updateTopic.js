import { gql } from "@apollo/client";

export const updateTopicMutation = gql`
  mutation UpdateTopic($topic: Int!, $active: Boolean!) {
    updateTopic(topic: $topic, active: $active)
  }
`;
