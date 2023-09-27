import { getAllSubjectsQuery } from "@/src/graphql/queries/getAllSubjects";
import { useQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CreateSubject from "./createSubject";

export default function Subjects({ subject, setSubject, canCreate = true }) {
  const { data, loading, error } = useQuery(getAllSubjectsQuery);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setSubjects(data?.getAllSubjects);
  }, [data]);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Autocomplete
        id="subjects"
        options={subjects ? subjects : []}
        onChange={(event, subject) => {
          const id = subject ? parseInt(subject["id"]) : null;
          setSubject(id);
        }}
        getOptionLabel={(option) => {
          return `${option["subjectName"]} | ${option["code"]}`;
        }}
        sx={{ width: 500 }}
        renderInput={(params) => <TextField {...params} label="Subjects" />}
      />
      {canCreate && !subject && <CreateSubject setSubject={setSubject} />}
    </>
  );
}
