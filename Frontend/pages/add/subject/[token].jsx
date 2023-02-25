import ValidateSubjectToken from "components/createSubjects/validateSubjectToken";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import Courses from "components/generate/courses";
import { Autocomplete } from "@mui/material";
import Subjects from "components/add/subject/subjects";

export default function AddSubject() {
  const router = useRouter();
  const [valid, setValid] = useState(false);
  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const { token } = router.query;

  if (!router.isReady) return <p>Loading</p>;

  console.log(course);

  return (
    <>
      <ValidateSubjectToken token={token} setValid={setValid}>
        <Courses setCourse={setCourse} setSemester={setSemester} />
        <Subjects setSubject={setSubject} />
      </ValidateSubjectToken>
    </>
  );
}
