import { createTopicMutation } from "@/src/graphql/mutations/createTopic";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function AddTopic({ router, allTopics, setAllTopics }) {
  const [createTopic, { data, loading, error }] =
    useMutation(createTopicMutation);

  const [topic, setTopic] = useState("");
  const [addTopic, setAddTopic] = useState(false);

  useEffect(() => {
    if (data && !allTopics.includes(data?.createTopic)) {
      setAllTopics([...allTopics, data?.createTopic]);
      setTopic("");
    }
  }, [data]);

  return (
    <>
      {!addTopic && (
        <Button variant="text" onClick={() => setAddTopic(true)}>
          Add New
        </Button>
      )}
      {addTopic && (
        <>
          <TextField
            id="new-topic"
            helperText={topic.length < 3 ? "Minimum 3 Characters" : ""}
            onChange={(e) => setTopic(e.target.value)}
            label="Topic"
            variant="outlined"
          />
          <Button
            variant="text"
            disabled={topic.length < 3}
            onClick={() => {
              if (topic?.length >= 3) {
                createTopic({
                  variables: {
                    name: topic,
                    regulation: parseInt(router.query.regulation),
                    programme: router.query.programme,
                    degree: router.query.degree,
                    semester: parseInt(router.query.semester),
                    department: router.query.branch,
                    subjectCode: router.query.subject_code,
                    unit: parseInt(router.query.unit),
                  },
                });
              }
              setAddTopic(false);
            }}
          >
            Save
          </Button>
        </>
      )}
    </>
  );
}
