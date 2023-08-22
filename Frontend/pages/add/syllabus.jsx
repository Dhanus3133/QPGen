import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Courses from "components/generate/courses";
import { Alert, Autocomplete, Button } from "@mui/material";
import Subjects from "components/add/subject/subjects";
import Lessons from "components/add/subject/lessons";
import { Box } from "@mui/system";
import ValidateSyllabus from "components/createSyllabus/validateSyllabus";
import { createSyllabusesMutation } from "@/src/graphql/mutations/createSyllabuses";

export default function AddSyllabus() {
  const [valid, setValid] = useState(false);
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [CreateSyllabuses, { data, loading, error }] = useMutation(
    createSyllabusesMutation
  );

  const handleSubmit = () => {
    const units = [];
    const lessonIds = [];
    lessons.map((lesson) => {
      lessonIds.push(parseInt(lesson["id"]));
      units.push(lesson["unit"]);
    });

    CreateSyllabuses({
      variables: { course: course, units: units, lessons: lessonIds },
    }).catch((error) => {
      console.log("Error: " + error);
    });
  };

  if (data?.createSyllabuses) {
    return <p>Syllabus has been created!</p>;
  }

  return (
    <>
      <ValidateSyllabus setValid={setValid}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box sx={{ pt: 2 }}>
            <Courses setCourse={setCourse} setSemester={setSemester} />
          </Box>
          <Box sx={{ pt: 2 }}>
            <Subjects subject={subject} setSubject={setSubject} />
          </Box>
          <Box sx={{ pt: 2 }}>
            <Lessons
              subject={subject}
              lessons={lessons}
              setLessons={setLessons}
            />
          </Box>
          {error && (
            <Alert sx={{ mt: 3, mb: 2 }} variant="filled" severity="error">
              {error.message}
            </Alert>
          )}
          <Button
            className="bg-[#1976d2]"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            disabled={lessons.length !== 5 || !valid}
          >
            Create
          </Button>
        </Box>
      </ValidateSyllabus>
    </>
  );
}
