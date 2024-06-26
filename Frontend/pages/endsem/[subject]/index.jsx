import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { endSemQuestionsQuery } from "@/src/graphql/queries/endSemQuestions";
import { Button } from "@mui/material";
import Vditor from "vditor";
import EditQuestion from "components/endsem/EditQuestion";
import RenderVditor from "components/renderVditor";
import { getEndSemSubjectsQuery } from "@/src/graphql/queries/getEndSemSubjects";
import DeleteQuestion from "components/endsem/DeleteQuestion";
import AddQuestion from "components/endsem/AddQuestion";
import COEOnly from "@/components/coe/COEOnly";

export default function EndSemQuestions() {
  const router = useRouter();
  const [vd, setVd] = useState(null);
  const [marks, setMarks] = useState(null);
  const [counts, setCounts] = useState(null);
  const [choices, setChoices] = useState(null);
  const [subjectID, setSubjectID] = useState(null);
  const { subject } = router.query;

  const { data, loading, error } = useQuery(endSemQuestionsQuery, {
    variables: {
      subject: subject,
    },
    skip: !subject,
  });

  const { data: subjectsData } = useQuery(getEndSemSubjectsQuery);

  const [questions, setQuestions] = useState(null);
  const [questionParts, setQuestionParts] = useState({});

  useEffect(() => {
    if (data?.endSemQuestions) {
      setQuestions(data?.endSemQuestions);
    }
  }, [data]);

  useEffect(() => {
    if (subjectsData?.getEndSemSubjects && subject) {
      subjectsData?.getEndSemSubjects.map((item) => {
        if (item.subject.code === subject) {
          setSubjectID(item.id);
          setMarks(item.marks);
          setCounts(item.counts);
          setChoices(item.choices);
        }
      });
    }
  }, [subjectsData, subject]);

  useEffect(() => {
    if (!vd) {
      const dummy = document.createElement("div");
      dummy.id = "dummy";
      dummy.style.display = "none";
      document.body.appendChild(dummy);
      const vditor = new Vditor("dummy", {
        after: () => {
          setVd(vditor);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (questions) {
      const newQuestionParts = {};
      let mark = 0;

      questions.forEach((question) => {
        const { part, number, roman } = question;

        if (!newQuestionParts[part]) {
          newQuestionParts[part] = [];
        }

        if (!newQuestionParts[part][number - 1]) {
          newQuestionParts[part][number - 1] = [];
        }

        if (!newQuestionParts[part][number - 1][roman - 1]) {
          newQuestionParts[part][number - 1][roman - 1] = [];
        }
        newQuestionParts[part][number - 1][roman - 1].push(question);
        mark += question.mark;
      });
      setQuestionParts(newQuestionParts);
    }
  }, [questions]);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  const getRoman = {
    1: "i",
    2: "ii",
    3: "iii",
  };

  const getPart = (num) => String.fromCharCode(65 + num);

  return (
    <div className="p-8">
      <COEOnly displayError={false}>
        <div className="p-2">
          <a href={`${router.asPath}/print`} target="_blank" rel="noreferrer">
            <Button
              className="bg-[#1976d2]"
              variant="contained"
              color="primary"
            >
              Print
            </Button>
          </a>
        </div>
      </COEOnly>
      {Object.keys(questionParts).map((part, i) => (
        <div className="w-full bg-white text-black p-4" key={`mainpart-${i}`}>
          <p className=" text-center font-bold text-2xl pb-5">
            Part {getPart(i)} (
            {`${counts[i]}x${marks[i]}=${marks[i] * counts[i]}`})
          </p>
          <div>
            {questionParts[part].map((part, j) => {
              let count = 0;
              return (
                <div className="w-full" key={`part-${j}`}>
                  <p className="text-md">
                    {part.map((roman) => {
                      let notOrAt;
                      if (part.length > 1) {
                        notOrAt = part[0]?.length + part[1]?.length;
                      }
                      return roman.map((option, k) => {
                        count += 1;
                        vd ? vd.setValue(option.question) : "";
                        return (
                          <div key={`roman-${k}`} className="flex flex-col">
                            <div className="flex m-2">
                              <span>
                                {option.number}.{" "}
                                {part.length > 1 &&
                                  `${getPart(option.roman - 1)}) `}
                                {marks[option.part - 1] !== 2 &&
                                  `${getRoman[option.option]})`}{" "}
                                &nbsp;
                              </span>
                              <p
                                id={`display-question-${option.id}`}
                                className="pr-4"
                                dangerouslySetInnerHTML={{
                                  __html: vd ? vd.getHTML() : "Loading...",
                                }}
                              ></p>
                              <span>
                                ({option.btl?.name}) (CO{option.co}) (
                                {option.mark}){" "}
                              </span>
                              <RenderVditor
                                id={`display-question-${option.id}`}
                              />
                              <EditQuestion
                                question={option}
                                subjectCode={subject}
                                is2Mark={marks[option.part - 1] === 2}
                              />
                              {roman.length > 1 && (
                                <DeleteQuestion
                                  question={option.id}
                                  subjectCode={subject}
                                />
                              )}
                              {marks[option.part - 1] !== 2 &&
                                roman.length < 3 &&
                                roman.length === k + 1 && (
                                  <AddQuestion
                                    subjectCode={subject}
                                    subject={subjectID}
                                    currentQuestion={option}
                                    is2Mark={marks[option.part - 1] === 2}
                                  />
                                )}
                            </div>
                            {part.length > 1 &&
                              roman.length === k + 1 &&
                              count !== notOrAt && (
                                <>
                                  <br />
                                  <p className="text-center font-bold">OR</p>
                                  <br />
                                </>
                              )}
                            {count === notOrAt && (
                              <hr className="border-2 border-black mb-5 w-full" />
                            )}
                          </div>
                        );
                      });
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
