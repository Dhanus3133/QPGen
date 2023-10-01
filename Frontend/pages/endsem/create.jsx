import { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import COEOnly from "components/coe/COEOnly";
import Subjects from "components/add/subject/subjects";
import Marks from "components/generate/marks";

import { useMutation } from "@apollo/client";
import { Button, Alert } from "@mui/material";
import { createEndSemSubjectMutation } from "@/src/graphql/mutations/createEndSemSubject";

export default function CreateEndSemSubject() {
  const [password, setPassword] = useState(null);
  const [createUserForSubject, { data }] = useMutation(
    createEndSemSubjectMutation,
  );

  function handleCreateEndSemSubject() {
    const password = Math.random().toString(36).slice(-10);
    setPassword(password);
    createUserForSubject({
      variables: {
        semester: Number(semester),
        subject: subject,
        password: password,
        marks: marks,
        counts: counts,
        choices: choices,
      },
    });
  }
  const [subject, setSubject] = useState(null);
  const [semester, setSemester] = useState(null);

  const [total, setTotal] = useState(null);
  const [marks, setMarks] = useState([]);
  const [_isSem, setIsSem] = useState(false);
  const [counts, setCounts] = useState([]);
  const [choices, setChoices] = useState([]);
  const [_time, setTime] = useState(null);
  const [examTitle, setExamTitle] = useState(null);
  const [_exam, setExam] = useState(null);
  const [valid, setValid] = useState(false);
  const [_units, setUnits] = useState([]);
  console.log(data?.createEndSemSubject);

  return (
    <>
      <COEOnly>
        <Grid container justifyContent="center" sx={{ pt: 4 }}>
          <Stack spacing={3} alignItems="center">
            <TextField
              id="semester"
              label="Semester"
              variant="outlined"
              InputProps={{ inputProps: { min: 1 } }}
              type="number"
              onChange={(e) => setSemester(e.target.value)}
            />
            <Subjects
              subject={subject}
              setSubject={setSubject}
              canCreate={false}
            />
            <Marks
              marks={marks}
              setMarks={setMarks}
              counts={counts}
              setCounts={setCounts}
              choices={choices}
              setChoices={setChoices}
              total={total}
              setTotal={setTotal}
              setUnits={setUnits}
              setTime={setTime}
              valid={valid}
              setValid={setValid}
              setExam={setExam}
              setIsSem={setIsSem}
              examTitle={examTitle}
              setExamTitle={setExamTitle}
            />
            <>
              {(data?.createEndSemSubject?.id && (
                <Alert
                  sx={{ mt: 3, mb: 2 }}
                  variant="filled"
                  severity="success"
                >
                  <p>Email: {data?.createEndSemSubject.email}</p>
                  <p>Password: {password}</p>
                </Alert>
              )) ||
                (data?.createEndSemSubject?.messages && (
                  <Alert
                    sx={{ mt: 3, mb: 2 }}
                    variant="filled"
                    severity="error"
                  >
                    {data?.createEndSemSubject?.messages[0].message}
                  </Alert>
                ))}
              {subject && (
                <Button
                  type="submit"
                  className="bg-[#1976d2]"
                  variant="contained"
                  color="primary"
                  onClick={handleCreateEndSemSubject}
                >
                  Create EndSem Subject
                </Button>
              )}
            </>
          </Stack>
        </Grid>
      </COEOnly>
    </>
  );
}
