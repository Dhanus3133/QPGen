import { useState } from "react";
import Courses from "components/generate/courses";
import { Button, Grid, TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Marks from "components/generate/marks";
import Subjects from "components/generate/subjects";
import Lessons from "components/generate/lessons";
import QuestionPaper from "components/generate/questionPaper";
import DateTime from "components/generate/qp/datetime";
import COEOnly from "components/coe/COEOnly";

export default function Generate() {
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [total, setTotal] = useState(null);
  const [marks, setMarks] = useState([]);
  const [isSem, setIsSem] = useState(false);
  const [isGate, setIsGate] = useState(false);
  const [counts, setCounts] = useState([]);
  const [choices, setChoices] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  const [time, setTime] = useState(null);
  const [examTitle, setExamTitle] = useState(null);
  const [exam, setExam] = useState(null);
  const [valid, setValid] = useState(false);
  const [subject, setSubject] = useState(null);
  const [units, setUnits] = useState([]);
  const [lessonsIDs, setLessonsIDs] = useState([]);
  const [generate, setGenerate] = useState(false);
  const [set, setSet] = useState(null);
  const [saveAnalysis, setSaveAnalysis] = useState(false);
  const [isRetest, setIsRetest] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [isAvoidQuestionIds, setIsAvoidQuestionIds] = useState(false);
  const [avoidQuestionIdsError, setavoidQuestionIdsError] = useState(null);
  const [avoidQuestionIds, setAvoidQuestionIds] = useState([]);

  if (!generate) {
    return (
      <COEOnly>
        <Grid container justifyContent="center">
          <div className="p-3 flex flex-col items-center">
            <DateTime dateTime={dateTime} setDateTime={setDateTime} />
            <div className="pt-3">
              <TextField
                id="set"
                label="Set"
                fullWidth
                variant="outlined"
                onChange={(e) => setSet(e.target.value)}
              />
            </div>
            <div className="py-4 text-center">
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    onChange={(e) => setSaveAnalysis(e.target.checked)}
                  />
                }
                label="Save Analysis?"
              />
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    onChange={(e) => setIsRetest(e.target.checked)}
                  />
                }
                label="Retest?"
              />
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    onChange={(e) => setUseAi(e.target.checked)}
                  />
                }
                label="Use AI?"
              />
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    onChange={(e) => {
                      setIsAvoidQuestionIds(e.target.checked);
                      if (!e.target.checked) {
                        setAvoidQuestionIds([]);
                      }
                    }}
                  />
                }
                label={"Avoid Question's?"}
              />
              <FormControlLabel
                required
                control={
                  <Checkbox
                    color="success"
                    onChange={(e) => setIsGate(e.target.checked)}
                  />
                }
                label="Is Gate?"
              />
            </div>
            {isAvoidQuestionIds && (
              <TextField
                fullWidth
                label={"Question ID's"}
                id="fullWidth"
                className="m-3"
                error={Boolean(avoidQuestionIdsError)}
                helperText={avoidQuestionIdsError}
                onChange={(e) => {
                  try {
                    const parsedJson = JSON.parse(e.target.value);
                    if (Array.isArray(parsedJson)) {
                      setavoidQuestionIdsError("");
                      setAvoidQuestionIds(parsedJson);
                    } else {
                      setavoidQuestionIdsError("Please provide an array.");
                    }
                  } catch (error) {
                    setavoidQuestionIdsError(
                      "Please provide a valid JSON array.",
                    );
                  }
                }}
              />
            )}
            <Courses setCourse={setCourse} setSemester={setSemester} />
            <div className="p-3"></div>
            <Subjects course={course} setSubject={setSubject} />
            <div className="p-3"></div>
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
            <Lessons
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
                  setGenerate(true);
                }
              }}
            >
              Generate
            </Button>
          </div>
        </Grid>
      </COEOnly>
    );
  } else {
    const navbar = document.getElementById("navbar");
    navbar.style.display = "none";
    return (
      <QuestionPaper
        course={course}
        lids={lessonsIDs}
        marks={marks}
        counts={counts}
        choices={choices}
        semester={semester}
        total={total}
        setTotal={setTotal}
        time={time}
        exam={examTitle}
        isSem={isSem}
        isGate={isGate}
        dateTime={dateTime}
        set={set}
        examID={exam}
        saveAnalysis={saveAnalysis}
        useAi={useAi}
        avoidQuestionIds={avoidQuestionIds}
        isRetest={isRetest}
      />
    );
  }
}
