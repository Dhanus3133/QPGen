import { getCoursesQuery } from "@/src/graphql/queries/getCourses";
import { useQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function Courses({ setCourse, setSemester }) {
  const { data, loading, error } = useQuery(getCoursesQuery);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(data?.getCourses);
  }, [data]);

  if (loading || !courses) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Autocomplete
      id="courses"
      options={courses}
      onChange={(_, course) => {
        const id = course ? parseInt(course["id"]) : null;
        setCourse(id);
        setSemester && setSemester(course["semester"]);
      }}
      getOptionLabel={(option) =>
        `${option["regulation"]["year"]} | ${option["department"]["programme"]["name"]} | ${option["department"]["degree"]["name"]} | ${option["department"]["branchCode"]} | ${option["semester"]}`
      }
      sx={{ width: 400 }}
      renderInput={(params) => <TextField {...params} label="Courses" />}
    />
  );
}
