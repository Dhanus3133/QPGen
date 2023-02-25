import { getAllSubjectsQuery } from "@/src/graphql/queries/getAllSubjects";
import { getSubjectsByIdQuery } from "@/src/graphql/queries/getSubjectsByID";
import { getID } from "@/src/utils";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Subjects({ setSubject }) {
  const { data, loading, error } = useQuery(getAllSubjectsQuery);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setSubjects(data?.getAllSubjects);
  }, [data]);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Autocomplete
      id="subjects"
      options={subjects}
      onChange={(event, subject) => {
        const id = subject ? parseInt(getID(subject["id"])) : null;
        setSubject(id);
      }}
      getOptionLabel={(option) => {
        return `${option["subjectName"]} | ${option["code"]}`;
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Subjects" />}
    />
  );
}
