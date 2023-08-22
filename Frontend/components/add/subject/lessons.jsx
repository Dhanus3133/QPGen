import { getLessonsBySubjectIdQuery } from "@/src/graphql/queries/getLessonsBySubjectID";
import { useLazyQuery } from "@apollo/client";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
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
import CreateLesson from "./createLesson";

export default function Lessons({ subject, lessons, setLessons }) {
  const [getLessons, { loading, error, data }] = useLazyQuery(
    getLessonsBySubjectIdQuery
  );

  useEffect(() => {
    if (subject !== null) getLessons({ variables: { subjectId: subject } });
  }, [subject]);

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

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return "Loading...";

  const handleUnitChange = (l, v) => {
    if (l["unit"] + v > 0 && l["unit"] + v <= 5) {
      const updatedLessons = lessons.map((lesson) => {
        if (l["id"] === lesson["id"]) {
          return { ...lesson, unit: lesson["unit"] + v };
        } else {
          return lesson;
        }
      });
      const sortedLessons = [...updatedLessons].sort((a, b) => a.unit - b.unit);
      setLessons(sortedLessons);
    }
  };
  if (!subject) {
    return <></>;
  }

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
                label="Unit No"
                type="number"
                variant="outlined"
                value={lesson["unit"]}
                disabled
              />
            </Grid>
            <Grid item>
              <TextField
                id={`lesson${unit}`}
                label="Name"
                variant="outlined"
                defaultValue={lesson["name"]}
                multiline
                disabled
              />
            </Grid>
            <Grid item>
              <ArrowCircleUpIcon onClick={() => handleUnitChange(lesson, 1)} />
            </Grid>
            <Grid item>
              <ArrowCircleDownIcon
                onClick={() => handleUnitChange(lesson, -1)}
              />
            </Grid>
          </Grid>
        );
      })}
      {lessons.length < 5 && <CreateLesson subject={subject} />}
    </>
  );
}
// MenuProps={MenuProps}
// onChange={handleChange}
// value={personName}
