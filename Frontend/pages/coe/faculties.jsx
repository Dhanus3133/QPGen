import { assignFacultiesMutation } from "@/src/graphql/mutations/assignFaculties";
import { FacultiesHandlingsQuery } from "@/src/graphql/queries/facultiesHandlings";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Alert, Button, CircularProgress, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import COEOnly from "components/coe/COEOnly";
import Faculties from "components/coe/faculties";
import Courses from "components/generate/courses";
import Subjects from "components/generate/subjects";
import { useEffect, useState } from "react";

export default function FacultiesHandling() {
  const [course, setCourse] = useState(null);
  const [subject, setSubject] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [success, setSuccess] = useState(false);
  const [FacultiesHandlings, { data }] = useLazyQuery(FacultiesHandlingsQuery);

  const [AssignFaculties, { loading: ALoading, data: AData }] = useMutation(
    assignFacultiesMutation,
    {
      refetchQueries: [
        {
          query: FacultiesHandlingsQuery,
          variables: {
            course: course,
            subject: subject,
          },
        },
      ],
    },
  );

  useEffect(() => {
    if (data?.facultiesHandlings.length > 0) {
      setFaculties(data?.facultiesHandlings[0]?.faculties);
    } else {
      setFaculties([]);
    }
  }, [data]);

  useEffect(() => {
    if (course && subject) {
      FacultiesHandlings({
        variables: { course, subject },
      });
    } else {
      setFaculties([]);
    }
    setSuccess(false);
  }, [course, subject]);

  useEffect(() => {
    if (AData?.assignFaculties) setSuccess(true);
  }, [AData]);

  const handleSubmit = () => {
    const userIDs = [];
    faculties.map((f) => {
      userIDs.push(parseInt(f["id"]));
    });
    AssignFaculties({
      variables: {
        course: course,
        subject: subject,
        faculties: userIDs,
      },
    });
  };
  console.log(AData);

  return (
    <>
      <COEOnly>
        <Grid container justifyContent="center" sx={{ pt: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Courses setCourse={setCourse} />
            <Subjects course={course} setSubject={setSubject} />
            <Stack spacing={3} sx={{ width: "28rem" }}>
              <Faculties faculties={faculties} setFaculties={setFaculties} />
            </Stack>
            {success && (
              <Alert variant="filled" severity="success">
                Faculties Assigned!
              </Alert>
            )}
            {!ALoading ? (
              <Button
                className="bg-[#1976d2]"
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Assign Subject
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled
              >
                <CircularProgress color="success" />
              </Button>
            )}
          </Stack>
        </Grid>
      </COEOnly>
    </>
  );
}
