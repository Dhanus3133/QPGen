import COEOnly from "components/coe/COEOnly";
import { useMutation, useQuery } from "@apollo/client";
import { allFacultiesQuery } from "@/src/graphql/queries/faculties";
import { useState } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { getID } from "@/src/utils";
import { assignSubjectToFacultiesMutation } from "@/src/graphql/mutations/assignSubjectsToFacutlies";

export default function AddSubjects() {
  const {
    data: facultiesData,
    loading: facultiesLoading,
    error: facultiesError,
  } = useQuery(allFacultiesQuery);

  const [AssignSubjects, { data, loading, error }] = useMutation(
    assignSubjectToFacultiesMutation
  );

  const [faculties, setFaculties] = useState([]);

  if (facultiesLoading) return "Loading...";

  if (facultiesError) return <p>Error: {facultiesError.message}</p>;

  if (error) return <p>Error: {error.message}</p>;

  const allFaculties = facultiesData?.faculties;

  const handleSubmit = (event) => {
    event.preventDefault();
    const facultyIds = [];
    faculties.map((faculty) => {
      facultyIds.push(parseInt(getID(faculty["id"])));
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
    return <p>Email Sent!</p>;
  }

  return (
    <COEOnly>
      <Grid container justifyContent="center" sx={{ pt: 4 }}>
        <Stack spacing={3} sx={{ width: "28rem" }}>
          <Autocomplete
            multiple
            id="faculties"
            options={allFaculties}
            value={faculties ? faculties : []}
            isOptionEqualToValue={(option, value) =>
              option["id"] === value["id"]
            }
            getOptionLabel={(option) =>
              option["fullName"] + " | " + option["email"]
            }
            filterSelectedOptions
            autoHighlight
            onChange={(_, t) => setFaculties([...t])}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Faculties"
                placeholder="Faculties"
              />
            )}
          />
          <p>Don't cross limit of 5 per minute and 20 per hour</p>
          {!loading ? (
            <Button
              type="submit"
              fullWidth
              className={
                faculties.length <= 5 ? "bg-[#1976d2]" : "bg-[#D32F2F]"
              }
              onClick={(event) => {
                if (faculties.length <= 5) {
                  handleSubmit(event);
                }
              }}
              variant="contained"
              color={faculties.length <= 5 ? "primary" : "error"}
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
