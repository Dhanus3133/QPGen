import { isCOEQuery } from "@/src/graphql/queries/isCOE";
import { useQuery } from "@apollo/client";

export default function COEOnly({ children, displayError = true }) {
  const { data, loading, error } = useQuery(isCOEQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      {data.isCoe ? (
        <>{children}</>
      ) : (
        displayError && <p>You don&apos;t have permission!</p>
      )}
    </>
  );
}
