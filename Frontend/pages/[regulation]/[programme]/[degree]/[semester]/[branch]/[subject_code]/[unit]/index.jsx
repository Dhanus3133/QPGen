import { getLessonsQuery } from "@/src/graphql/queries/getLessons";
import Router from "next/router";
import { getQuestionsQuery } from "@/src/graphql/queries/getQuestions";
import { useLazyQuery, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Vditor from "vditor";
import InitializeVditor from "components/InitializeVditor";
// import { md2html } from "vditor/src/ts/markdown/previewRender";
import RenderVditor from "components/renderVditor";

export default function Lesson() {
  const router = useRouter();
  const [vd, setVd] = useState(null);

  const limit = 20;
  // console.log(md2html("hello"));
  let {
    regulation,
    programme,
    degree,
    semester,
    branch,
    subject_code,
    unit,
    page,
  } = router.query;

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
      <h1>Questions</h1>
      {questions?.map((question, itr) => {
        const q = question["node"];
        vd ? vd.setValue(q["question"]) : "";
        return (
          <div key={question["cursor"]}>
            <div
              id={q["id"]}
              dangerouslySetInnerHTML={{
                __html: vd ? vd.getHTML() : "Loading...",
              }}
            ></div>
            <Link
              href={{
                pathname: `${router.pathname}/[questionNumber]`,
                query: {
                  ...router.query,
                  questionNumber: parseInt(atob(q["id"]).split(":")[1]),
                },
              }}
            >
              <h2>
                <RenderVditor id={q["id"]} />| {q["mark"]["start"]} -{" "}
                {q["mark"]["end"]}
              </h2>
            </Link>
            <br />
          </div>
        );
      })}
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
    </>
  );
}
// <Link href={{ pathname: router.asPath, query: { page: 3 } }}>3</Link>
