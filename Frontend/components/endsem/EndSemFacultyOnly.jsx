import { isEndSemFacultyQuery } from "@/src/graphql/queries/isEndSemFaculty";
import { useQuery } from "@apollo/client";

export default function EndSemFacultyOnly({ children }) {
  const { data, loading, error } = useQuery(isEndSemFacultyQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      {data.isEndSemFaculty ? (
        <>{children}</>
      ) : (
        <p>You don&apos;t have permission!</p>
      )}
    </>
  );
}
