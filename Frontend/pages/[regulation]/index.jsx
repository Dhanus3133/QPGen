import { departmentsAccessToQuery } from "@/src/graphql/queries/deptAccess";
import { useQuery } from "@apollo/client";
import SuperCard from "components/SuperCard";
import { useRouter } from "next/router";

export default function Regulation() {
  const router = useRouter();
  const { regulation } = router.query;

  const { data, loading, error } = useQuery(departmentsAccessToQuery, {
    ssr: false,
  });

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  const regulation_data = data?.departmentsAccessTo;

  const filteredData = regulation_data.filter(function (item) {
    return item["course"]["regulation"]["year"] == regulation;
  });
  // console.log(filteredData);

  let cleanData = [];
  filteredData.map((item) => {
    let course = item["course"];
    cleanData.push({
      id: course["id"],
      href: course["department"]["programme"]["name"],
      text: `${course["department"]["programme"]["name"]}`,
    });
  });

  return (
    <>
      <SuperCard
        data={cleanData}
        currentPath={router.asPath}
        type="Programme"
      />
    </>
  );
}
