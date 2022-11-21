import { getSubjectsQuery } from "@/src/graphql/queries/getSubjects";
import { useLazyQuery, useQuery } from "@apollo/client";
import SubjectCard from "components/SubjectCard";
import { useRouter } from "next/router";
import { useEffect } from "react";

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

  console.log(data);

  if (data?.getSubjects.length == 0)
    return <h1 className="text-center">You have no permission to access!</h1>;

  return (
    <>
      <h1 className="text-center">Welcome to {branch}</h1>
      <SubjectCard
        data={data?.getSubjects}
        currentPath={router.asPath}
        branch={branch}
      />
    </>
  );
}
