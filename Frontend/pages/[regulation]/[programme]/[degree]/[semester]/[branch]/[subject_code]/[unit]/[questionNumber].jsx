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
import "styles/Question.module.css";

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
      <div className="flex flex-row justify-evenly mb-10">
        <div className="w-3/5 mt-5">
          <h1 className="text-4xl mt-4 ml-10 mr-10 font-bold font-roboto">Question ID - {questionNumber}</h1>
          <br />
          <p className="text-2xl ml-10 mr-10 font-semibold font-poppins mt-2">Question:</p>
          <div className="mt-2 ml-10 mr-10 border-2 border-black rounded-md shadow-lg">
            <CustomVditor
              id="question"
              value={question ? question["question"] : ""}
              vd={vQuestion}
              setVd={vSetQuestion}
            />
          </div>
          <p className="text-2xl ml-10 mr-10 mt-4 font-semibold">Answer:</p>
          <div className="mt-2 ml-10 mr-10 border-2 border-black rounded-md shadow-lg"> 
            <CustomVditor
              id="answer" 
              value={question ? question["answer"] : ""}
              vd={vAnswer}
              setVd={vSetAnswer}
            />
          </div>
        </div>
      <div className="mt-8 w-5/12 mr-10 border-black px-5 py-4 rounded-lg border-2 shadow-xl">
        <div className="mt-2 flex justify-start items-center">
          <p className="text-xl mr-5 font-medium">Mark Range:{" "}</p>
          <div className="ml-2 mt-0.5">
            <MarkRanges markRange={markRange} setMarkRange={setMarkRange} />
          </div>
        </div>
        <div className="mt-2 flex justify-start items-center">
          <p className="text-xl  mr-5 font-medium">Blooms Taxonomy Level:</p> 
          <div className="ml-2 mt-0.5">
            <BloomsTaxonomies btl={btl} setBtl={setBtl} />
          </div>
        </div>
        <div className="mt-2 flex justify-start items-center">
          <p className="text-xl mr-5 font-medium">Difficulty:{" "}</p>
          <div className="ml-2 mt-0.5">
            <Difficulty difficulty={difficulty} setDifficulty={setDifficulty} />
          </div>
        </div>
        <div className="flex mt-2 justify-between items-start">
          <p className="text-xl mr-1 mt-2 font-medium">Topics:</p>
          <div className="mt-0.5">
            <Topics router={router} topics={topics} setTopics={setTopics} />
          </div>
        </div>
        <div className="flex mt-2 justify-between items-baseline">
          <p className="text-xl mr-1 mt-2 font-medium">Previous Years:{" "}</p>
          <div className="mt-0.5">
            <PreviousYears 
              previousYears={previousYears}
              setPreviousYears={setPreviousYears}
            />
          </div>
        </div>
        {question ? (
        <div className="mt-10 mb-3 ">
          <Button
            variant="outlined"
            size="large"
            color="primary"
            sx = {{width: "100%"}}
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
        </div>
        ) : (
          <div className="ml-1 mt-3 mb-3">
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
          
        </div>
        )}
        </div>
      </div>
    </>
  );
}
