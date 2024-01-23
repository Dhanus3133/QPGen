import { useEffect, useState } from "react";
import Courses from "components/generate/courses";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Marks from "components/generate/marks";
import Lessons from "components/generate/lessons";
import QuestionPaper from "components/generate/questionPaper";
import DateTime from "components/generate/qp/datetime";
import COEOnly from "components/coe/COEOnly";
import Subjects from "@/components/add/subject/subjects";
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

  const { data, loading, error } = useQuery(getAllSubjectsQuery);
  const [allSubjects, setAllSubjects] = useState([]);

  const [
    getLessons,
    { loading: lessonsLoading, error: lessonsError, data: lessonsData },
  ] = useLazyQuery(getLessonsByIdQuery);

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
            {subjects.map((subject, idx) => {
              return (
                <div className="p-3 pl-0">
                  <h4 className="mb-3">Subject {idx + 1}</h4>
                  <Autocomplete
                    id="subjects"
                    options={allSubjects}
                    onChange={(event, subject) => {
                      const id = subject ? parseInt(subject["id"]) : null;
                      const tempSubjects = [...subjects];
                      getLessons({
                        variables: {
                          subjectId: id,
                        },
                      })
                        .then((response) => {
                          tempSubjects[idx]["lessons"] =
                            response.data?.getLessonsById;
                        })
                        .catch((err) => {
                          console.error("Error fetching data:", err);
                        });
                      tempSubjects[idx]["units"] = [];
                      tempSubjects[idx]["subject"] = id;
                      setSubjects(tempSubjects);
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
                    <h3>Lessons</h3>
                    {subjects[idx]["lessons"].map((lesson) => {
                      return (
                        <h3 key={`lesson-${lesson["lesson"]["id"]}`}>
                          <Checkbox
                            color="success"
                            onChange={(e) => {
                              let tempSubjects = [...subjects];
                              if (e.target.checked) {
                                tempSubjects[idx]["units"].push({
                                  lesson: lesson["lesson"]["id"],
                                  unit: lesson["unit"],
                                  marks: {},
                                });
                              } else {
                                tempSubjects[idx]["units"].splice(
                                  tempSubjects[idx]["units"].findIndex(
                                    (x) => x.lesson === lesson["lesson"]["id"],
                                  ),
                                  1,
                                );
                              }
                              setSubjects(tempSubjects);
                            }}
                          />

                          {lesson["lesson"]["name"]}
                        </h3>
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
                          setSubjects(tempSubjects);
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
