import { getQuestionQuery } from "@/src/graphql/queries/getQuestion";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomVditor from "components/vditor";
import style from "styles/Question.module.css";
import MarkRanges from "components/question/MarkRanges";
import BloomsTaxonomies from "components/question/BloomsTaxonomies";
import Difficulty from "components/question/Difficulty";
import Topics from "components/question/Topics";
import PreviousYears from "components/question/PreviousYears";
import { Button } from "@mui/material";
import { createQuestionMutation } from "@/src/graphql/mutations/createQuestion";
import { getLessonsQuery } from "@/src/graphql/queries/getLessons";
import { meQuery } from "@/src/graphql/queries/me";
import { updateQuestionMutation } from "@/src/graphql/mutations/updateQuestion";
import { getQuestionsQuery } from "@/src/graphql/queries/getQuestions";

export default function EditQuestion() {
  const router = useRouter();
  const { questionNumber } = router.query;

  const [user, setUser] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [question, setQuestion] = useState(null);
  const [vQuestion, vSetQuestion] = useState(null);
  const [vAnswer, vSetAnswer] = useState(null);
  const [markRange, setMarkRange] = useState(null);
  const [btl, setBtl] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [topics, setTopics] = useState([]);
  const [previousYears, setPreviousYears] = useState([]);

  const globalID = btoa(`QuestionType:${questionNumber}`);

  const {
    regulation,
    programme,
    degree,
    semester,
    branch,
    subject_code,
    unit,
  } = router.query;

  const { data: uData } = useQuery(meQuery);

  const { data: lData } = useQuery(getLessonsQuery, {
    ssr: false,
    skip: !router.isReady,
    variables: {
      regulation: parseInt(regulation),
      programme: programme,
      degree: degree,
      semester: parseInt(semester),
      department: branch,
      subjectCode: subject_code,
    },
  });

  const [
    createQuestion,
    { data: cQuestion, loading: cLoading, error: cError },
  ] = useMutation(createQuestionMutation, {
    onCompleted: (data) => {
      router.back();
    },
    refetchQueries: [
      {
        query: getQuestionsQuery,
        variables: {
          regulation: parseInt(regulation),
          programme: programme,
          degree: degree,
          semester: parseInt(semester),
          department: branch,
          subjectCode: subject_code,
          unit: parseInt(unit),
        },
      },
      {
        query: getQuestionQuery,
        variables: {
          id: globalID,
        },
      },
    ],
  });

  const [updateQuestion, { data: uQuestion, data: uLoading, data: uError }] =
    useMutation(updateQuestionMutation, {
      onCompleted: (data) => {
        router.back();
      },
      refetchQueries: [
        {
          query: getQuestionsQuery,
          variables: {
            regulation: parseInt(regulation),
            programme: programme,
            degree: degree,
            semester: parseInt(semester),
            department: branch,
            subjectCode: subject_code,
            unit: parseInt(unit),
          },
        },
        {
          query: getQuestionQuery,
          variables: {
            id: globalID,
          },
        },
      ],
    });

  const [loadQuestion, { data, called, loading, error }] = useLazyQuery(
    getQuestionQuery,
    {
      skip: !router.isReady,
      variables: {
        id: globalID,
      },
    }
  );

  useEffect(() => {
    setQuestion(data?.question);
    setMarkRange(data?.question["mark"]["id"]);
    setBtl(data?.question["btl"]["id"]);
    setDifficulty(data?.question.difficulty);
    setTopics(data?.question.topics);
    setPreviousYears(data?.question.previousYears);
  }, [data]);

  useEffect(() => {
    setLesson(lData?.getLessons);
    const lId = lData?.getLessons.find(
      (lesson) => lesson["unit"] === parseInt(unit)
    )["lesson"]["id"];
    setLesson(lId);
  }, [lData]);

  useEffect(() => {
    setUser(uData?.me["id"]);
  }, [uData]);

  if (!router.isReady || loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  if (questionNumber !== "add" && !called) {
    loadQuestion();
  }

  return (
    <>
      <h1>Quesion ID - {questionNumber}</h1>
      <br />
      Question:
      <CustomVditor
        id="question"
        value={question ? question["question"] : ""}
        vd={vQuestion}
        setVd={vSetQuestion}
      />
      Answer:
      <CustomVditor
        id="answer"
        value={question ? question["answer"] : ""}
        vd={vAnswer}
        setVd={vSetAnswer}
      />
      <div className="">
        Mark Range:{" "}
        <MarkRanges markRange={markRange} setMarkRange={setMarkRange} />
      </div>
      <div className="">
        Blooms Taxonomy Level: <BloomsTaxonomies btl={btl} setBtl={setBtl} />
      </div>
      <div className="">
        Difficulty:{" "}
        <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
      </div>
      <div className="">
        Topics: <Topics router={router} topics={topics} setTopics={setTopics} />
      </div>
      <div className="">
        Previous Years:{" "}
        <PreviousYears
          previousYears={previousYears}
          setPreviousYears={setPreviousYears}
        />
      </div>
      {question ? (
        <Button
          variant="contained"
          onClick={() => {
            const topicsQL = [];
            const previousYearsQL = [];
            topics?.map((topic) => {
              topicsQL.push({ id: topic["id"] });
            });
            previousYears?.map((prevYear) => {
              previousYearsQL.push({ id: prevYear["id"] });
            });
            updateQuestion({
              variables: {
                id: globalID,
                question: vQuestion.getValue(),
                answer: vAnswer.getValue(),
                mark: markRange,
                btl: btl,
                difficulty: difficulty,
                topics: topicsQL,
                previousYears: previousYearsQL,
              },
            });
          }}
        >
          Update Question
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const topicsQL = [];
            const previousYearsQL = [];
            topics?.map((topic) => {
              topicsQL.push({ id: topic["id"] });
            });
            previousYears?.map((prevYear) => {
              previousYearsQL.push({ id: prevYear["id"] });
            });
            createQuestion({
              variables: {
                lesson: lesson,
                question: vQuestion.getValue(),
                answer: vAnswer.getValue(),
                mark: markRange,
                btl: btl,
                difficulty: difficulty,
                createdBy: user,
                topics: topicsQL,
                previousYears: previousYearsQL,
              },
            });
          }}
        >
          Add Question
        </Button>
      )}
    </>
  );
}
