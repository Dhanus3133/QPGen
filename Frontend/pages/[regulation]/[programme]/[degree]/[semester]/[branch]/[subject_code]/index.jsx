import { getLessonsQuery } from "@/src/graphql/queries/getLessons";
import { useQuery } from "@apollo/client";
import SuperCard from "components/SuperCard";
import { useRouter } from "next/router";

export default function Subject() {
  const router = useRouter();
  const { regulation, programme, degree, semester, branch, subject_code } =
    router.query;

  const { data, loading, error } = useQuery(getLessonsQuery, {
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

  if (!router.isReady || loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  let cleanData = [];
  data?.getLessons.map((lesson) => {
    cleanData.push({
      id: lesson["id"],
      href: lesson["unit"],
      text: `${lesson["unit"]} | ${lesson["lesson"]["name"]}`,
    });
  });

  return (
    <>
      <SuperCard data={cleanData} currentPath={router.asPath} type="Lesson" />
    </>
  );
}
