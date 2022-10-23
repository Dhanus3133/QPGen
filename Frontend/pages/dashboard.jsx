import { client } from "@/lib/apollo-client";
import { departmentsAccessToQuery } from "@/src/graphql/queries/deptAccess";
import { allUsersQuery } from "@/src/graphql/queries/users";
import { useQuery } from "@apollo/client";
import DashboardCard from "components/DashboardCard"; 

export default function Dashboard() {
  const { data, loading, error } = useQuery(departmentsAccessToQuery, {
    ssr: false,
  });
  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <DashboardCard data={data?.departmentsAccessTo} />
    </>
  );
}

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: departmentsAccessToQuery,
//   });
//
//   return {
//     props: { data: data },
//   };
// }
