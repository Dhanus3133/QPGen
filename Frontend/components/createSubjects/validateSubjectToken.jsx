import { validateCreateSubjectTokenQuery } from "@/src/graphql/queries/validateCreateSubjectToken";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export default function ValidateSubjectToken({ children, token, setValid }) {
  const { data, loading, error } = useQuery(validateCreateSubjectTokenQuery, {
    variables: { token: token },
  });

  useEffect(() => {
    setValid(data?.validateCreateSubjectToken);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (data?.validateCreateSubjectToken) {
    return <>{children}</>;
  }
  return <p>Invalid Token</p>;
}
