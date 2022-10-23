import { departmentsAccessToQuery } from "@/src/graphql/queries/deptAccess";
import { useQuery } from "@apollo/client";
import DegreeCard from "components/DegreeCard";
import { useRouter } from "next/router";

export default function Programme() {
  const router = useRouter();
  const { regulation, programme } = router.query;

  const { data, loading, error } = useQuery(departmentsAccessToQuery, {
    ssr: false,
  });

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const programme_data = data?.departmentsAccessTo;

  const filteredData = programme_data.filter(function (item, n) {
    return (
      item["course"]["regulation"]["year"] == regulation &&
      item["course"]["department"]["programme"]["name"] == programme
    );
  });
  console.log(filteredData);

  return (
    <>
      <DegreeCard data={filteredData} currentPath={router.asPath} />
    </>
  );
}
