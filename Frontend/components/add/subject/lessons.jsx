import { getLessonsBySubjectIdQuery } from "@/src/graphql/queries/getLessonsBySubjectID";
import { getID } from "@/src/utils";
import { useLazyQuery } from "@apollo/client";
import {
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Lessons({ subject, lessons, setLessons }) {
  const [getLessons, { loading, error, data }] = useLazyQuery(
    getLessonsBySubjectIdQuery
  );

  useEffect(() => {
    const newLessons = [];
    data?.getLessonsBySubjectId.map((lesson, unit) => {
      newLessons.push({
        id: lesson["id"],
        unit: unit + 1,
        name: lesson["name"],
      });
    });
    setLessons(newLessons);
  }, [data]);

  useEffect(() => {
    if (subject !== null) {
      getLessons({
        variables: {
          subjectId: subject,
        },
      });
    } else {
      setLessons([]);
    }
  }, [subject]);

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return "Loading...";

  const handleUnitChange = (event, l) => {
    if (0 > event.target.value < 10) {
      const updatedLessons = lessons.map((lesson) => {
        if (l["id"] === lesson["id"]) {
          return { ...lesson, unit: parseInt(event.target.value) };
        } else {
          return lesson;
        }
      });
      const sortedLessons = [...updatedLessons].sort((a, b) => a.unit - b.unit);
      setLessons(sortedLessons);
    }
  };

  return (
    <>
      {lessons?.map((lesson, unit) => {
        return (
          <Grid
            key={lesson["id"]}
            container
            spacing={2}
            sx={{ p: 1.5 }}
            alignItems="center"
          >
            <Grid item>
              <TextField
                id={`unit${unit}`}
                label="Unit"
                type="number"
                variant="outlined"
                defaultValue={lesson["unit"]}
                onChange={(event) => handleUnitChange(event, lesson)}
              />
            </Grid>
            <Grid item>
              <TextField
                id={`lesson${unit}`}
                label="Lesson"
                variant="outlined"
                defaultValue={lesson["name"]}
                multiline
                disabled
              />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}
// MenuProps={MenuProps}
// onChange={handleChange}
// value={personName}
