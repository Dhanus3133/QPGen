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
  // const { data, loading, error } = useQuery(getCoursesQuery);
  // variables: {
  //   lessons: [1, 2, 3],
  // },
  // const { data, loading, error } = useQuery(generateQuestionsQuery);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [marks, setMarks] = useState([2, 12, 16]);
  const [counts, setCounts] = useState([5, 2, 1]);
  const [choices, setChoices] = useState([false, true, true]);
  const [valid, setValid] = useState(false);
  const [subject, setSubject] = useState(null);
  const [lessonsIDs, setLessonsIDs] = useState([]);
  const [generate, setGenerate] = useState(false);

  // useEffect(() => {
  //   setCourse(1);
  //   setSubject(1);
  // }, [course, subject]);

  // if (loading) return "Loading...";
  // if (error) return <p>Error: {error.message}</p>;
  if (!generate) {
    return (
      <>
        <Grid container justifyContent="center">
          <div className="p-3 center">
            <Marks
              marks={marks}
              setMarks={setMarks}
              counts={counts}
              setCounts={setCounts}
              choices={choices}
              setChoices={setChoices}
              valid={valid}
              setValid={setValid}
            />
            <div className="py-6">
              <Courses setCourse={setCourse} />
            </div>
            <Subjects course={course} setSubject={setSubject} />
            <div className="p-6"></div>
            <Lessons
              course={course}
              subject={subject}
              lessonsIDs={lessonsIDs}
              setLessonsIDs={setLessonsIDs}
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
      />
    );
  }
}
// <Subjects course={course} setLesson={setLesson} />
