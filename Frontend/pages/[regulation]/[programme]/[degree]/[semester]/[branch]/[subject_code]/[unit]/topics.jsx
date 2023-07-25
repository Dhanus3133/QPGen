import { updateTopicMutation } from "@/src/graphql/mutations/updateTopic";
import { getTopicsQuery } from "@/src/graphql/queries/getTopics";
import { getID } from "@/src/utils";
import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, Grid, Switch } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Topics() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);

  const topicsVariables = {
    regulation: parseInt(router.query.regulation),
    programme: router.query.programme,
    degree: router.query.degree,
    semester: parseInt(router.query.semester),
    department: router.query.branch,
    subjectCode: router.query.subject_code,
    unit: parseInt(router.query.unit),
  };

  const { data, loading, error } = useQuery(getTopicsQuery, {
    skip: !router.isReady,
    variables: topicsVariables,
  });

  const [UpdateTopic, { loading: uLoading }] = useMutation(
    updateTopicMutation,
    {
      refetchQueries: [
        {
          query: getTopicsQuery,
          variables: topicsVariables,
        },
      ],
    }
  );

  useEffect(() => {
    setTopics(data?.getTopics);
  }, [data]);

  if (!router.isReady || loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  const handleToggleActive = (id) => {
    const updatedTopics = topics.map((topic) => {
      if (topic.id === id) {
        return { ...topic, active: !topic.active };
      }
      return topic;
    });
    setTopics(updatedTopics);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h2>Topics</h2>
        {topics?.map((topic) => {
          return (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ pt: 4 }}
              key={topic["id"]}
            >
              <h2>{topic["name"]}</h2>
              <Switch
                checked={topic["active"]}
                onChange={() => handleToggleActive(topic.id)}
              />
              <Button
                className="bg-[#1976d2]"
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  UpdateTopic({
                    variables: {
                      topic: parseInt(getID(topic["id"])),
                      active: topic["active"],
                    },
                  }).catch((error) => {
                    console.log("Error: " + error);
                  });
                }}
              >
                Save
              </Button>
            </Grid>
          );
        })}
      </Box>
    </>
  );
}
