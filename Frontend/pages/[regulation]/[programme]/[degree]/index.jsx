import { departmentsAccessToQuery } from "@/src/graphql/queries/deptAccess";
import { useQuery } from "@apollo/client";
import SuperCard from "components/SuperCard";
import { useRouter } from "next/router";

export default function Degree() {
  const router = useRouter();
  const { regulation, programme, degree } = router.query;

  const { data, loading, error } = useQuery(departmentsAccessToQuery, {
    ssr: false,
  });

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const programme_data = data?.departmentsAccessTo;

  const filteredData = programme_data.filter(function (item) {
    return (
      item["course"]["regulation"]["year"] == regulation &&
      item["course"]["department"]["programme"]["name"] == programme &&
      item["course"]["department"]["degree"]["name"] == degree
    );
  });

  let cleanData = [];
  filteredData.map((item) => {
    let course = item["course"];
    cleanData.push({
      id: course["id"],
      href: course["semester"],
      text: `${course["semester"]}`,
    });
  });

  return (
    <>
      <SuperCard data={cleanData} currentPath={router.asPath} type="Semester" />
    </>
  );
}
