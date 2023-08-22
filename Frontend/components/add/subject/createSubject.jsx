import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@apollo/client";
import { createSubjectMutation } from "@/src/graphql/mutations/createSubject";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { getAllSubjectsQuery } from "@/src/graphql/queries/getAllSubjects";
import { Alert } from "@mui/material";

export default function CreateSubject({ setSubject }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [CreateSubject, { data, loading }] = useMutation(
    createSubjectMutation,
    {
      refetchQueries: [
        {
          query: getAllSubjectsQuery,
        },
      ],
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateSubject = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    CreateSubject({
      variables: {
        code: data.get("subjectCode").trim(),
        subjectName: data.get("subjectName").trim(),
        co: data.get("subjectCO").trim(),
      },
    }).catch((error) => {
      console.log("Error: " + error);
    });
  };

  useEffect(() => {
    if (data?.createSubject.messages) {
      setError(data?.createSubject.messages[0].message);
    }
    if (data?.createSubject?.id) {
      setError(null);
      handleClose();
    }
  }, [data]);

  return (
    <div>
      <Button className="mt-4" variant="outlined" onClick={handleClickOpen}>
        Create New Subject
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box
          component="form"
          noValidate
          onSubmit={handleCreateSubject}
          sx={{ mt: 3 }}
        >
          <DialogTitle>New Subject</DialogTitle>
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
                id="code"
                name="subjectCode"
                label="Subject Code"
                type="text"
                variant="standard"
                fullWidth
              />
              <TextField
                autoFocus
                id="name"
                name="subjectName"
                label="Subject Name"
                type="text"
                variant="standard"
                fullWidth
              />
              <TextField
                autoFocus
                id="co"
                name="subjectCO"
                label="Subject CO"
                type="text"
                variant="standard"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
