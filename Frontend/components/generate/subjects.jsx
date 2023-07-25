import { getSubjectsByIdQuery } from "@/src/graphql/queries/getSubjectsByID";
import { getID } from "@/src/utils";
import { useLazyQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Subjects({ course, setSubject }) {
  const [getSubjects, { loading, error, data }] =
    useLazyQuery(getSubjectsByIdQuery);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setSubjects(data?.getSubjectsById);
  }, [data]);

  useEffect(() => {
    if (course) {
      getSubjects({
        variables: {
          courseId: course,
        },
      });
    } else {
      setSubjects([]);
    }
  }, [course]);

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
      sx={{ width: 400 }}
      renderInput={(params) => <TextField {...params} label="Subjects" />}
    />
  );
}
