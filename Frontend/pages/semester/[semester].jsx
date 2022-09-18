import { useRouter } from "next/router";

const Semester = () => {
  const router = useRouter();
  const { semester } = router.query;
  return (
    <>
      <h1>Semester - {semester}</h1>
    </>
  );
};

export default Semester;
