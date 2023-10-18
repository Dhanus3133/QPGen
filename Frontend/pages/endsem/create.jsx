import { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import COEOnly from "components/coe/COEOnly";
import Subjects from "components/add/subject/subjects";
import Marks from "components/generate/marks";

import { useMutation } from "@apollo/client";
import { Button, Alert } from "@mui/material";
import { createEndSemSubjectMutation } from "@/src/graphql/mutations/createEndSemSubject";
import Regulation from "@/components/endsem/Regulation";

export default function CreateEndSemSubject() {
  const [password, setPassword] = useState(null);
  const [createUserForSubject, { data, loading }] = useMutation(
    createEndSemSubjectMutation,
  );

  function handleCreateEndSemSubject() {
    const password = Math.random().toString(36).slice(-10);
    setPassword(password);
    createUserForSubject({
      variables: {
        regulation: Number(regulation),
        semester: Number(semester),
        subject: subject,
        password: password,
        marks: marks,
        counts: counts,
        choices: choices,
        isInternal: isInternal,
        isExternal: !isInternal,
      },
    })
      .then((_) => {
        setErr(null);
      })
      .catch((error) => {
        setErr(error?.message);
      });
  }
  const [subject, setSubject] = useState(null);
  const [semester, setSemester] = useState(null);
  const [regulation, setRegulation] = useState(null);

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
  const [isInternal, setIsInternal] = useState(true);
  const [err, setErr] = useState(null);

  return (
    <>
      <COEOnly>
        <Grid container justifyContent="center" sx={{ pt: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Regulation regulation={regulation} setRegulation={setRegulation} />
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
            <div className="text-center">
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                  />
                }
                label="Internal?"
              />
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    checked={!isInternal}
                    onChange={(e) => setIsInternal(!e.target.checked)}
                  />
                }
                label="External?"
              />
            </div>

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
                )) ||
                (err && (
                  <Alert
                    sx={{ mt: 3, mb: 2 }}
                    variant="filled"
                    severity="error"
                  >
                    {err}
                  </Alert>
                ))}
              {subject && (
                <Button
                  type="submit"
                  className="bg-[#1976d2]"
                  variant="contained"
                  color="primary"
                  disabled={loading}
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
