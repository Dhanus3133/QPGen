import Link from "next/link";

export default function SemesterCard({ data, currentPath }) {
  if (data.length == 0)
    return <h1 className="text-center">You have no permission in here!</h1>;

  return (
    <>
      {data?.map((item) => {
        const course = item["course"];
        return (
          <div key={course["id"]} className="text-center">
            <Link
              href={`${currentPath}/${encodeURIComponent(
                course["semester"]
              )}`}
            >
              <h3 className="cursor-pointer">
                {course["semester"]}
              </h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
