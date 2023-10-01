import Link from "next/link";
import { useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import COEOnly from "components/coe/COEOnly";
import EndSemFacultyOnly from "components/endsem/EndSemFacultyOnly";
import { getEndSemSubjectsQuery } from "@/src/graphql/queries/getEndSemSubjects";
import SuperCard from "components/SuperCard";

export default function EndSem() {
  const { data, loading, error } = useQuery(getEndSemSubjectsQuery);

  if (loading) return "Loading...";
  if (error) return <p>Error: {error.message}</p>;

  let cleanData = [];
  data?.getEndSemSubjects.map((item) => {
    const subject = item["subject"];
    cleanData.push({
      id: item["id"],
      href: `${subject["code"]}`,
      text: `${subject["subjectName"]} | ${subject["code"]}`,
    });
  });

  return (
    <>
      <COEOnly displayError={false}>
        <div className="p-2">
          <Link href="/endsem/create">
            <Button
              type="submit"
              className="bg-[#1976d2]"
              variant="contained"
              color="primary"
            >
              Create a new Subject
            </Button>
          </Link>
        </div>
      </COEOnly>
      <EndSemFacultyOnly>
        <SuperCard data={cleanData} currentPath="/endsem" type="Subject" />
      </EndSemFacultyOnly>
    </>
  );
}
