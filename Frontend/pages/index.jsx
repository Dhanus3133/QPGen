import Link from "next/link";
import { Button } from "@mui/material";
import { departmentsAccessToQuery } from "@/src/graphql/queries/deptAccess";
import { useQuery } from "@apollo/client";
import SuperCard from "components/SuperCard";
import EndSemFacultyOnly from "components/endsem/EndSemFacultyOnly";

export default function Dashboard() {
  const { data, loading, error } = useQuery(departmentsAccessToQuery, {
    ssr: false,
  });
  if (loading) return "Loading...";
  // if (error) return <p>Error: {error.message}</p>;

  let cleanData = [];
  data?.departmentsAccessTo.map((item) => {
    const course = item["course"];
    cleanData.push({
      id: course["id"],
      href: `${course["regulation"]["year"]}/${course["department"]["programme"]["name"]}/${course["department"]["degree"]["name"]}/${course["semester"]}/${course["department"]["branchCode"]}`,
      text: `${course["regulation"]["year"]} | ${course["department"]["programme"]["name"]} | ${course["department"]["degree"]["name"]} | ${course["semester"]} | ${course["department"]["branchCode"]}`,
    });
  });

  return (
    <>
      <EndSemFacultyOnly errorDisplay={false}>
        <Link href="/endsem">
          <Button
            type="submit"
            className="bg-[#1976d2] m-5"
            variant="contained"
            color="primary"
          >
            Click here to go to EndSem Page
          </Button>
        </Link>
      </EndSemFacultyOnly>

      <SuperCard data={cleanData} currentPath="" type="Course" />
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
