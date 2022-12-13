import { getQuestionsQuery } from "@/src/graphql/queries/getQuestions";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Vditor from "vditor";
import RenderVditor from "components/renderVditor";
import style from "styles/Question.module.css";
import { Button } from "@mui/material";

export default function Lesson() {
  const router = useRouter();
  const [vd, setVd] = useState(null);

  const limit = 20;
  // console.log(md2html("hello"));
  let { page } = router.query;

  const pageNo = parseInt(page) || 1;
  const after = btoa(`arrayconnection:${(pageNo - 1) * limit - 1}`);
  const { data, loading, error } = useQuery(getQuestionsQuery, {
    ssr: false,
    skip: !router.isReady,
    variables: {
      regulation: parseInt(router.query.regulation),
      programme: router.query.programme,
      degree: router.query.degree,
      semester: parseInt(router.query.semester),
      department: router.query.branch,
      subjectCode: router.query.subject_code,
      unit: parseInt(router.query.unit),
      first: limit,
      after: after,
    },
  });

  const questions = data?.getQuestions["edges"];

  const totalCount = data?.getQuestions["totalCount"];
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

  if (!router.isReady || loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className={`${style.container} mx-auto mt-6`}>
        <h1 className={`${style.heading} mt-5 text-7xl`}>Questions</h1>
        <p className={`${style.paragraph} ml-1 mb-10 mt-2 text-xl`}>
          Questions are listed below for the selected unit
        </p>
        <p className={`${style.paragraph} ml-1 mb-10`}>
          <Link
            href={{
              pathname: `${router.pathname}/[questionNumber]`,
              query: {
                ...router.query,
                questionNumber: "add",
              },
            }}
          >
            <Button variant="text">Add new question</Button>
          </Link>
        </p>
      </div>
      <div id="questions" className="mb-5">
        {questions?.map((question, itr) => {
          const q = question["node"];
          vd ? vd.setValue(q["question"]) : "";
          return (
            <div key={question["cursor"]}>
              <div className="flex flex-row py-2 w-3/4 mx-auto">
                <div
                  id={q["id"]}
                  className={`basis-10/12 pl-4 ${style.paragraph}`}
                  dangerouslySetInnerHTML={{
                    __html: vd ? vd.getHTML() : "Loading...",
                  }}
                ></div>
                <div className={`basis-2/12 text-right pr-3`}>
                  <RenderVditor id={q["id"]} />
                  {q["mark"]["start"]} - {q["mark"]["end"]}
                </div>
                <Link
                  href={{
                    pathname: `${router.pathname}/[questionNumber]`,
                    query: {
                      ...router.query,
                      questionNumber: parseInt(atob(q["id"]).split(":")[1]),
                    },
                  }}
                >
                  <div className="basis-2/12 text-right pr-3">
                    <Button variant="text">View</Button>
                  </div>
                </Link>
                <br />
              </div>
              <div className={`${style.line} w-3/4 bg-slate-500 mx-auto`}></div>
            </div>
          );
        })}
      </div>

      <Stack alignItems="center">
        <Pagination
          count={Math.floor(totalCount / limit)}
          page={pageNo}
          color="primary"
          variant="outlined"
          onChange={(e, p) => {
            router.push({
              pathname: router.pathname,
              query: { ...router.query, page: p },
            });
          }}
        />
      </Stack>
      <div className="h-20">

      </div>
    </>
  );
}
