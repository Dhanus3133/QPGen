import { createTopicMutation } from "@/src/graphql/mutations/createTopic";
import { getTopicsQuery } from "@/src/graphql/queries/getTopics";
import { getID } from "@/src/utils";
import { useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function AddTopic({ router, lesson, allTopics, setAllTopics }) {
  const [createTopic, { data, loading, error }] = useMutation(
    createTopicMutation,
    {
      refetchQueries: [
        {
          query: getTopicsQuery,
          variables: {
            regulation: parseInt(router.query.regulation),
            programme: router.query.programme,
            degree: router.query.degree,
            semester: parseInt(router.query.semester),
            department: router.query.branch,
            subjectCode: router.query.subject_code,
            unit: parseInt(router.query.unit),
          },
        },
      ],
    }
  );

  const [topic, setTopic] = useState("");
  const [addTopic, setAddTopic] = useState(false);
  const [err, setErr] = useState(null);

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
        <div className="mt-3">
          <TextField
            id="new-topic"
            helperText={topic.length < 3 ? "Minimum 3 Characters" : "" || err}
            onChange={(e) => {
              setTopic(e.target.value);
              if (error?.message) {
                setErr(null);
              }
            }}
            label="Topic"
            variant="outlined"
            error={topic.length < 3 || err}
          />
          <div className="my-3">
            <Button
              variant="text"
              onClick={() => {
                setAddTopic(false);
              }}
            >
              Cancel
            </Button>
            {!loading && (
              <Button
                variant="text"
                disabled={topic.length < 3}
                onClick={() => {
                  if (topic?.length >= 3) {
                    createTopic({
                      variables: {
                        name: topic,
                        lesson: parseInt(getID(lesson)),
                        regulation: parseInt(router.query.regulation),
                        programme: router.query.programme,
                        degree: router.query.degree,
                        semester: parseInt(router.query.semester),
                        department: router.query.branch,
                        subjectCode: router.query.subject_code,
                        unit: parseInt(router.query.unit),
                      },
                    })
                      .then((_) => {
                        setAddTopic(false);
                      })
                      .catch((error) => {
                        setErr(error?.message);
                      });
                  }
                }}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
