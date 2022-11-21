import { getLessonsQuery } from "@/src/graphql/queries/getLessons";
import { useQuery } from "@apollo/client";
import LessonCard from "components/LessonCard";
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

  return (
    <>
      <LessonCard data={data?.getLessons} currentPath={router.asPath} />
    </>
  );
}
