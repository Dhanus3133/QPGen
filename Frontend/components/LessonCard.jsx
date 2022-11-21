import Link from "next/link";
import BackButton from "./Back";

export default function LessonCard({ data, currentPath }) {
  if (data?.length == 0)
    return <h1 className="text-center">You have no permission in here!</h1>;

  return (
    <>
      <BackButton />
      {data?.map((lesson) => {
        return (
          <div key={lesson["id"]} className="text-center">
            <Link href={`${currentPath}/${encodeURIComponent(lesson["unit"])}`}>
              <h3 className="cursor-pointer">
                {lesson["unit"]} | {lesson["lesson"]["name"]}
              </h3>
            </Link>
          </div>
        );
      })}
    </>
  );
}
// href={`${currentPath}/${encodeURIComponent(subject["code"])}`}
