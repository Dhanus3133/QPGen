import { getLessonsQuery } from "@/src/graphql/queries/getLessons";
import { useQuery } from "@apollo/client";
import LessonCard from "components/LessonCard";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Subject() {
  const router = useRouter();
  const {
    regulation,
    programme,
    degree,
    semester,
    branch,
    subject_code,
    lesson,
  } = router.query;

  const { data, loading, error } = useQuery(getLessonsQuery, {
    ssr: false,
    variables: {
      regulation: parseInt(regulation),
      programme: programme,
      degree: degree,
      semester: parseInt(semester),
      department: branch,
      subjectCode: subject_code,
    },
  });

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  const lessons_data = data?.getLessons;

  const lesson_id = lessons_data.find((item) => item["unit"] == lesson);

  // href={{ pathname: `${router.asPath}/add`, query: { name: "test" } }}
  // <Link
  //   href={{
  //     pathname: `/[regulation]/add`,
  //     query: { regulation: regulation },
  //   }}
  // >
  //   <h1>Click me</h1>
  // </Link>;
  console.log(lesson_id["id"]);
  return (
    <>
      <h1>Click me</h1>
      <h1>Lesson</h1>
    </>
  );
}
// <LessonCard data={data?.getLessons} currentPath={router.asPath} />
