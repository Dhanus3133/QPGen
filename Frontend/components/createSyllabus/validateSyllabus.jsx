import { validateCreateSyllabusQuery } from "@/src/graphql/queries/validateCreateSubjectToken";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export default function ValidateSyllabus({ children, setValid }) {
  const { data, loading, error } = useQuery(validateCreateSyllabusQuery);

  useEffect(() => {
    setValid(data?.validateCreateSyllabus);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data?.validateCreateSyllabus) {
    return <>{children}</>;
  }
  return <p>You don&apos;t have yet the permission to create!</p>;
}
