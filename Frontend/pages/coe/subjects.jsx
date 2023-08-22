import COEOnly from "components/coe/COEOnly";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { assignSubjectToFacultiesMutation } from "@/src/graphql/mutations/assignSubjectsToFacutlies";
import Faculties from "components/coe/faculties";

export default function AddSubjects() {
  const [AssignSubjects, { data, loading, error }] = useMutation(
    assignSubjectToFacultiesMutation,
  );

  const [faculties, setFaculties] = useState([]);

  if (error) return <p>Error: {error.message}</p>;

  const handleSubmit = (event) => {
    event.preventDefault();
    const facultyIds = [];
    faculties.map((faculty) => {
      facultyIds.push(parseInt(faculty["id"]));
    });
    AssignSubjects({
      variables: {
        faculties: facultyIds,
      },
    }).catch((error) => {
      console.log("Error: " + error);
    });
    setFaculties([]);
  };

  if (data?.assignSubjectToFaculties) {
    return <p>They can now create!</p>;
  }

  return (
    <COEOnly>
      <Grid container justifyContent="center" sx={{ pt: 4 }}>
        <Stack spacing={3} sx={{ width: "28rem" }}>
          <Faculties faculties={faculties} setFaculties={setFaculties} />
          {!loading ? (
            <Button
              type="submit"
              fullWidth
              className="bg-[#1976d2]"
              onClick={(event) => {
                if (faculties.length <= 5) {
                  handleSubmit(event);
                }
              }}
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Invites
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
  );
}
