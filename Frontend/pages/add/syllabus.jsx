import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import Courses from "components/generate/courses";
import { Autocomplete, Button } from "@mui/material";
import Subjects from "components/add/subject/subjects";
import Lessons from "components/add/subject/lessons";
import { Box } from "@mui/system";
import ValidateSyllabus from "components/createSyllabus/validateSyllabus";

export default function AddSubject() {
  const [valid, setValid] = useState(false);
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [lessons, setLessons] = useState([]);

  return (
    <>
      <ValidateSyllabus setValid={setValid}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box sx={{ pt: 2 }}>
            <Courses setCourse={setCourse} setSemester={setSemester} />
          </Box>
          <Box sx={{ pt: 2 }}>
            <Subjects setSubject={setSubject} />
          </Box>
          <Box sx={{ pt: 2 }}>
            <Lessons
              subject={subject}
              lessons={lessons}
              setLessons={setLessons}
            />
          </Box>
          <Button
            className="bg-[#1976d2]"
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              console.log(lessons);
            }}
          >
            Create
          </Button>
        </Box>
      </ValidateSyllabus>
    </>
  );
}
