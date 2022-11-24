import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Courses from "components/generate/courses";
import { Button, Grid } from "@mui/material";
import Marks from "components/generate/marks";
import Subjects from "components/generate/subjects";
import Lessons from "components/generate/lessons";
import { useRouter } from "next/router";
import QuestionPaper from "components/generate/questionPaper";

const { getCoursesQuery } = require("@/src/graphql/queries/getCourses");
const { useQuery } = require("@apollo/client");

export default function Generate() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [total, setTotal] = useState(null);
  const [marks, setMarks] = useState([]);
  const [counts, setCounts] = useState([]);
  const [choices, setChoices] = useState([]);
  const [time, setTime] = useState(null);
  const [valid, setValid] = useState(false);
  const [subject, setSubject] = useState(null);
  const [units, setUnits] = useState([]);
  const [lessonsIDs, setLessonsIDs] = useState([]);
  const [generate, setGenerate] = useState(false);

  // useEffect(() => {
  //   setCourse(1);
  //   setSubject(1);
  // }, [course, subject]);
  console.log("semester", semester);
  if (!generate) {
    return (
      <>
        <Grid container justifyContent="center">
          <div className="p-3 center">
            <div className="py-6">
              <Courses setCourse={setCourse} setSemester={setSemester} />
            </div>
            <Subjects course={course} setSubject={setSubject} />
            <div className="p-6"></div>
            <Marks
              marks={marks}
              setMarks={setMarks}
              counts={counts}
              setCounts={setCounts}
              choices={choices}
              setChoices={setChoices}
              total={total}
              setTotal={setTotal}
              units={units}
              setUnits={setUnits}
              time={time}
              setTime={setTime}
              valid={valid}
              setValid={setValid}
            />
            <Lessons
              course={course}
              subject={subject}
              units={units}
              setUnits={setUnits}
              lessonsIDs={lessonsIDs}
              setLessonsIDs={setLessonsIDs}
              valid={valid}
              setValid={setValid}
            />
            <Button
              variant="outlined"
              color={valid ? "success" : "error"}
              onClick={() => {
                if (valid) {
                  console.log(lessonsIDs);
                  console.log(marks);
                  console.log(counts);
                  console.log(choices);
                  setGenerate(true);
                }
              }}
            >
              Generate
            </Button>
          </div>
        </Grid>
      </>
    );
  } else {
    return (
      <QuestionPaper
        lids={lessonsIDs}
        marks={marks}
        counts={counts}
        choices={choices}
        semester={semester}
        total={total}
        time={time}
      />
    );
  }
}
// <Subjects course={course} setLesson={setLesson} />
