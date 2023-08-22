import { getLessonsByIdQuery } from "@/src/graphql/queries/getLessonsByID";
import { useLazyQuery } from "@apollo/client";
import { Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

export default function Lessons({
  course,
  subject,
  units,
  setUnits,
  lessonsIDs,
  setLessonsIDs,
}) {
  const [getLessons, { loading, error, data }] =
    useLazyQuery(getLessonsByIdQuery);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    setLessons(data?.getLessonsById);
  }, [data]);

  useEffect(() => {
    if (course !== null && subject !== null) {
      getLessons({
        variables: {
          courseId: course,
          subjectId: subject,
        },
      });
    } else {
      setLessons([]);
    }
  }, [course, subject]);

  useEffect(() => {
    let l = [];
    lessons?.map((lesson) => {
      if (units.includes(lesson["unit"])) {
        l.push(parseInt(lesson["lesson"]["id"]));
      }
    });
    setLessonsIDs([...l]);
  }, [subject, units]);

  if (error) return <p>Error: {error.message}</p>;
  if (loading) return "Loading...";

  const handleChange = (e, unit) => {
    const checked = e.target.checked;
    if (checked) {
      setUnits([...units, unit]);
    } else {
      units.splice(units.indexOf(unit), 1);
      setUnits([...units]);
    }
  };

  return (
    <div className="m-2 mt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Select the Units</h1>
        <div className="rounded-md border-2 border-emerald-500 bg-emerald-100 p-1 text-sm">
          {lessonsIDs.length} Units are selected
        </div>
      </div>
      <ul className="list-none">
        {lessons?.map((lesson) => {
          return (
            <li
              key={lesson["id"]}
              className="m-1 flex items-center rounded-md p-2 shadow-md"
            >
              <Checkbox
                checked={units.includes(lesson["unit"])}
                onChange={(e) => handleChange(e, lesson["unit"])}
              />
              <h2 className="p-2">
                Unit - {lesson["unit"]} - {lesson["lesson"]["name"]}
              </h2>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
// MenuProps={MenuProps}
// onChange={handleChange}
// value={personName}
