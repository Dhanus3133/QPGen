import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@apollo/client";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { Alert, Grid } from "@mui/material";
import { createLessonMutation } from "@/src/graphql/mutations/createLesson";
import { getLessonsBySubjectIdQuery } from "@/src/graphql/queries/getLessonsBySubjectID";
import BloomsTaxonomies from "./BloomsTaxonomies";

export default function CreateLesson({ subject }) {
  const [open, setOpen] = useState(false);
  const [btls, setBtls] = useState([]);
  const [error, setError] = useState(null);
  const [CreateLesson, { data, loading }] = useMutation(createLessonMutation, {
    refetchQueries: [
      {
        query: getLessonsBySubjectIdQuery,
        variables: {
          subjectId: subject,
        },
      },
    ],
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateLesson = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const btlIDs = [];
    btls.map((btl) => btlIDs.push(parseInt(btl["id"])));
    CreateLesson({
      variables: {
        subject: subject,
        name: data.get("LessonName"),
        objective: data.get("Objective"),
        outcome: data.get("Outcome"),
        outcomeBtl: btlIDs,
      },
    }).catch((error) => {
      console.log("Error: " + error);
    });
    setBtls([]);
  };

  useEffect(() => {
    if (data?.createLesson.messages) {
      setError(data?.createLesson.messages[0].message);
    }
    if (data?.createLesson?.id) {
      setError(null);
      handleClose();
    }
  }, [data]);

  return (
    <div>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        className="mt-2"
      >
        <Button variant="outlined" onClick={handleClickOpen}>
          Create New Unit
        </Button>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <Box
          component="form"
          noValidate
          onSubmit={handleCreateLesson}
          sx={{ mt: 3 }}
        >
          <DialogTitle>Create a New Unit</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ pb: 1 }}>
              Enter the Details properly, incase of any mistakes inform to Exam
              Cell
            </DialogContentText>
            {error && (
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
            )}
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                id="name"
                name="LessonName"
                label="Unit Title"
                type="text"
                variant="standard"
                fullWidth
                sx={{ pt: 1 }}
              />
              <TextField
                autoFocus
                id="objecttive"
                name="Objective"
                label="Course Objective"
                type="text"
                variant="standard"
                sx={{ pt: 1 }}
                fullWidth
                multiline
              />
              <TextField
                autoFocus
                id="outcome"
                name="Outcome"
                label="Course Outcome"
                type="text"
                variant="standard"
                sx={{ pt: 1 }}
                fullWidth
                multiline
              />
              <Box sx={{ pt: 4 }}>
                <BloomsTaxonomies btls={btls} setBtls={setBtls} />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {loading ? "Loading..." : <Button type="submit">Create</Button>}
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
