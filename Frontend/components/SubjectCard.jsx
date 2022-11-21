import Link from "next/link";

export default function SubjectCard({ data, currentPath, branch }) {
  if (data.length == 0)
    return <h1 className="text-center">You have no permission in here!</h1>;

  return (
    <>
      {data?.map((item) => {
        const subject = item["subject"];
        return (
          <div key={subject["id"]} className="text-center">
            <Link
              href={`${currentPath}/${encodeURIComponent(subject["code"])}`}
            >
              <h3 className="cursor-pointer">
                {subject["subjectName"]} | {subject["code"]}
              </h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
// href={`${currentPath}/${encodeURIComponent(subject["code"])}`}
