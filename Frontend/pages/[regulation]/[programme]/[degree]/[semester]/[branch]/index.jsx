import { getSubjectsQuery } from "@/src/graphql/queries/getSubjects";
import { useQuery } from "@apollo/client";
import SuperCard from "components/SuperCard";
import { useRouter } from "next/router";

export default function Branch() {
  const router = useRouter();
  const { regulation, programme, degree, semester, branch } = router.query;

  const { data, loading, error } = useQuery(getSubjectsQuery, {
    ssr: false,
    skip: !router.isReady,
    variables: {
      regulation: parseInt(regulation),
      programme: programme,
      degree: degree,
      semester: parseInt(semester),
      department: branch,
    },
  });

  if (!router.isReady || loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  let cleanData = [];
  data?.getSubjects.map((item) => {
    let subject = item["subject"];
    cleanData.push({
      id: subject["id"],
      href: subject["code"],
      text: `${subject["subjectName"]} | ${subject["code"]}`,
    });
  });

  return (
    <>
      <SuperCard data={cleanData} currentPath={router.asPath} type="Subject" />
    </>
  );
}
