import { getTopicsQuery } from "@/src/graphql/queries/getTopics";
import { useQuery } from "@apollo/client";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import AddTopic from "./AddTopic";

export default function Topics({ router, topics, setTopics }) {
  const { data, loading, error } = useQuery(getTopicsQuery, {
    skip: !router.isReady,
    variables: {
      regulation: parseInt(router.query.regulation),
      programme: router.query.programme,
      degree: router.query.degree,
      semester: parseInt(router.query.semester),
      department: router.query.branch,
      subjectCode: router.query.subject_code,
      unit: parseInt(router.query.unit),
    },
  });

  const [allTopics, setAllTopics] = useState([]);

  useEffect(() => {
    setAllTopics(data?.getTopics);
  }, [data]);

  if (!router.isReady || loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  return (
    allTopics && (
      <>
        <Stack spacing={3} sx={{ width: "28rem" }}>
          <Autocomplete
            multiple
            id="topics"
            options={allTopics}
            value={topics ? topics : []}
            isOptionEqualToValue={(option, value) =>
              option["id"] === value["id"]
            }
            getOptionLabel={(option) => option["name"]}
            filterSelectedOptions
            onChange={(e, t) => setTopics([...t])}
            renderInput={(params) => (
              <TextField {...params} label="Topics" placeholder="Topics" />
            )}
          />
        </Stack>
        <AddTopic
          router={router}
          allTopics={allTopics}
          setAllTopics={setAllTopics}
        />
      </>
    )
  );
}
