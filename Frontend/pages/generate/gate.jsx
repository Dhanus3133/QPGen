import { useEffect, useState } from "react";
import Courses from "components/generate/courses";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Marks from "components/generate/marks";
import QuestionPaper from "components/generate/gate/questionPaper";
import DateTime from "components/generate/qp/datetime";
import COEOnly from "components/coe/COEOnly";
import { getAllSubjectsQuery } from "@/src/graphql/queries/getAllSubjects";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getLessonsByIdQuery } from "@/src/graphql/queries/getLessonsByID";

export default function Generate() {
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [total, setTotal] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [isSem, setIsSem] = useState(false);
  const [isGate, setIsGate] = useState(true);
  const [counts, setCounts] = useState([]);
  const [choices, setChoices] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  const [time, setTime] = useState(null);
  const [examTitle, setExamTitle] = useState(null);
  const [exam, setExam] = useState(null);
  const [valid, setValid] = useState(false);
  const [units, setUnits] = useState([]);
  const [lessonsIDs, setLessonsIDs] = useState([]);
  const [generate, setGenerate] = useState(false);
  const [set, setSet] = useState(null);
  const [isRetest, setIsRetest] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [isAvoidQuestionIds, setIsAvoidQuestionIds] = useState(false);
  const [avoidQuestionIdsError, setavoidQuestionIdsError] = useState(null);
  const [avoidQuestionIds, setAvoidQuestionIds] = useState([]);

  const { data, loading, error } = useQuery(getAllSubjectsQuery);
  const [allSubjects, setAllSubjects] = useState([]);

  const [getLessons] = useLazyQuery(getLessonsByIdQuery);

  useEffect(() => {
    setAllSubjects(data?.getAllSubjects);
  }, [data]);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  console.log(subjects);

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
                    checked={isGate}
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
                className="my-3"
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
            <div className="p-3"></div>
            <Courses setCourse={setCourse} setSemester={setSemester} />
            <div className="p-3"></div>
            {subjects.map((subject, idx) => {
              return (
                <div className="py-2">
                  <h4 className="mb-3">Subject {idx + 1}</h4>
                  <Autocomplete
                    id="subjects"
                    options={allSubjects}
                    onChange={(event, subject) => {
                      const id = subject ? parseInt(subject["id"]) : null;
                      const tempSubjects = [...subjects];
                      if (!id) {
                        tempSubjects[idx]["units"] = [];
                        tempSubjects[idx]["lessons"] = [];
                        tempSubjects[idx]["subject"] = null;
                        setSubjects([...tempSubjects]);
                        return null;
                      }
                      tempSubjects[idx]["units"] = [];
                      tempSubjects[idx]["subject"] = id;
                      setSubjects([...tempSubjects]);
                      getLessons({
                        variables: {
                          subjectId: id,
                        },
                      })
                        .then((response) => {
                          tempSubjects[idx]["lessons"] =
                            response.data?.getLessonsById;
                          setSubjects([...tempSubjects]);
                        })
                        .catch((err) => {
                          console.error("Error fetching data:", err);
                        });
                    }}
                    getOptionLabel={(option) => {
                      return `${option["subjectName"]} | ${option["code"]}`;
                    }}
                    sx={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField {...params} label={`Subject ${idx + 1}`} />
                    )}
                  />
                  <div className="p-3">
                    {subjects[idx]["lessons"].length > 0 && <h2>Lessons</h2>}
                    {subjects[idx]["lessons"].map((lesson) => {
                      return (
                        <>
                          <h3 key={`lesson-${lesson["lesson"]["id"]}`}>
                            <Checkbox
                              color="success"
                              onChange={(e) => {
                                let tempSubjects = [...subjects];
                                if (e.target.checked) {
                                  tempSubjects[idx]["units"].push({
                                    lesson: lesson["lesson"]["id"],
                                    unit: lesson["unit"],
                                    marks: [0, 0],
                                  });
                                } else {
                                  tempSubjects[idx]["units"].splice(
                                    tempSubjects[idx]["units"].findIndex(
                                      (x) =>
                                        x.lesson === lesson["lesson"]["id"],
                                    ),
                                    1,
                                  );
                                }
                                setSubjects([...tempSubjects]);
                              }}
                            />
                            {lesson["unit"]} - {lesson["lesson"]["name"]}
                          </h3>
                          {subjects[idx]["units"].find(
                            (unit) => unit.lesson === lesson["lesson"]["id"],
                          ) && (
                            <>
                              <TextField
                                label="1 Marks Count"
                                type="number"
                                variant="outlined"
                                InputProps={{
                                  inputProps: { min: 1 },
                                }}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  let tempSubjects = [...subjects];
                                  const unitIdx = tempSubjects[idx][
                                    "units"
                                  ].findIndex(
                                    (unit) =>
                                      unit.lesson === lesson["lesson"]["id"],
                                  );
                                  tempSubjects[idx]["units"][unitIdx][
                                    "marks"
                                  ][0] = val ? parseInt(val) : 0;
                                  setSubjects([...tempSubjects]);
                                }}
                              />
                              <TextField
                                label="2 Marks Count"
                                type="number"
                                variant="outlined"
                                InputProps={{
                                  inputProps: { min: 1 },
                                }}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  let tempSubjects = [...subjects];
                                  const unitIdx = tempSubjects[idx][
                                    "units"
                                  ].findIndex(
                                    (unit) =>
                                      unit.lesson === lesson["lesson"]["id"],
                                  );
                                  tempSubjects[idx]["units"][unitIdx][
                                    "marks"
                                  ][1] = val ? parseInt(val) : 0;
                                  setSubjects([...tempSubjects]);
                                }}
                              />
                            </>
                          )}
                        </>
                      );
                    })}
                  </div>
                  {idx === subjects.length - 1 && (
                    <div className="mt-3 text-center">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const tempSubjects = [...subjects];
                          tempSubjects.splice(idx, 1);
                          setSubjects([...tempSubjects]);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="text-center">
              <Button
                variant="outlined"
                onClick={() => {
                  setSubjects([
                    ...subjects,
                    {
                      subject: null,
                      lessons: [],
                      units: [],
                    },
                  ]);
                }}
              >
                Add Subject
              </Button>
            </div>
            <Button
              variant="outlined"
              color={valid ? "success" : "error"}
              onClick={() => {
                if (valid) {
                  let lids = [];
                  let counts = [];
                  let marks = [];
                  let choices = [];

                  subjects.forEach((subject, idx) => {
                    if (idx === 0) {
                      subject["units"].forEach((unit) => {
                        if (unit["marks"][0] > 0) {
                          lids.push(parseInt(unit["lesson"]));
                          marks.push([1]);
                          counts.push([unit["marks"][0]]);
                          choices.push([false]);
                        }
                        if (unit["marks"][1] > 0) {
                          lids.push(parseInt(unit["lesson"]));
                          marks.push([2]);
                          counts.push([unit["marks"][1]]);
                          choices.push([false]);
                        }
                      });
                      return null;
                    }
                    subject["units"].forEach((unit) => {
                      if (unit["marks"][0] > 0) {
                        lids.push(parseInt(unit["lesson"]));
                        marks.push([1]);
                        counts.push([unit["marks"][0]]);
                        choices.push([false]);
                      }
                    });
                    subject["units"].forEach((unit) => {
                      if (unit["marks"][1] > 0) {
                        lids.push(parseInt(unit["lesson"]));
                        marks.push([2]);
                        counts.push([unit["marks"][1]]);
                        choices.push([false]);
                      }
                    });
                  });
                  setLessonsIDs(lids);
                  setCounts(counts);
                  setMarks(marks);
                  setChoices(choices);
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
        subjects={subjects}
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
        useAi={useAi}
        avoidQuestionIds={avoidQuestionIds}
        isRetest={isRetest}
      />
    );
  }
}
