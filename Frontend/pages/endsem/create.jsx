import { useState } from "react";
import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import COEOnly from "components/coe/COEOnly";
import Subjects from "components/add/subject/subjects";
import Faculties from "components/coe/faculties";
import CreateUser from "components/endsem/CreateAUser";
import Marks from "components/generate/marks";

export default function CreateEndSemSubject() {
  const [subject, setSubject] = useState(null);

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

  return (
    <>
      <COEOnly>
        <Grid container justifyContent="center" sx={{ pt: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Subjects
              subject={subject}
              setSubject={setSubject}
              canCreate={false}
            />
            <CreateUser subject={subject} />
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
          </Stack>
        </Grid>
      </COEOnly>
    </>
  );
}
