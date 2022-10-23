import Link from "next/link";

export default function DashboardCard({ data }) {
  if (data.length == 0)
    return <h1 className="text-center">You have no permission in here!</h1>;

  return (
    <>
      {data?.map((item) => {
        const course = item["course"];
        return (
          <div key={course["id"]} className="text-center">
            <Link
              href={`/${course["regulation"]["year"]}/${course["department"]["programme"]["name"]}/${course["department"]["degree"]["name"]}/${course["semester"]}/${course["department"]["branchCode"]}`}
            >
              <h3 className="cursor-pointer">
                {course["regulation"]["year"]} |{" "}
                {course["department"]["programme"]["name"]} |{" "}
                {course["department"]["degree"]["name"]} |{" "}
                {course["semester"]} |{" "}
                {course["department"]["branchCode"]}
              </h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
