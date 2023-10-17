import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import CustomVditor from "components/vditor";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useMutation } from "@apollo/client";
import { endSemQuestionsQuery } from "@/src/graphql/queries/endSemQuestions";
import { updateEndSemQuestionMutation } from "@/src/graphql/mutations/updateEndSemQuestion";

export default function EditQuestion({ question, subjectCode, is2Mark }) {
  const [open, setOpen] = useState(false);
  const [vQuestion, vSetQuestion] = useState(null);
  const [updateEndSemQuestion, { data, loading }] = useMutation(
    updateEndSemQuestionMutation,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: endSemQuestionsQuery,
          variables: {
            subject: subjectCode,
          },
        },
      ],
    },
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    }
    setOpen(false);
    vSetQuestion(null);
  };

  const getPart = (num) => String.fromCharCode(65 + num);

  const getRoman = {
    1: "i",
    2: "ii",
    3: "iii",
  };

  const handleUpdateQuestion = (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);
    updateEndSemQuestion({
      variables: {
        id: question.id,
        option: parseInt(dataForm.get("option")) || question.option,
        mark: parseInt(dataForm.get("mark")) || question.mark,
        question: vQuestion.getValue(),
      },
    });
  };

  useEffect(() => {
    if (data?.updateEndSemQuestion?.id && open) {
      handleClose();
    }
  }, [data]);

  return (
    <>
      <Button onClick={handleOpen}>
        <FaEdit />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "95%", maxHeight: "85vh" } }}
        maxWidth="false"
        disableBackdropClick
      >
        <Box component="form" noValidate onSubmit={handleUpdateQuestion}>
          <DialogTitle>
            Edit Question - ({question.number}
            {getPart(question.roman - 1)}) ({getRoman[question.option]})
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ pb: 1 }}>
              Question - {question.number})
              {!is2Mark &&
                open &&
                ` ${getPart(question.roman - 1)}. ${
                  getRoman[question.option]
                })`}
            </DialogContentText>
            <Box sx={{ pt: 1 }}>
              <FormControl style={{ minWidth: 120 }}>
                <InputLabel id="option-select-label">Option</InputLabel>
                <Select
                  id="new-option"
                  name="option"
                  defaultValue={question.option}
                  label="Option"
                  disabled={is2Mark}
                >
                  <MenuItem value={1}>i</MenuItem>
                  <MenuItem value={2}>ii</MenuItem>
                  <MenuItem value={3}>iii</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="new-mark"
                name="mark"
                label="Mark"
                variant="outlined"
                defaultValue={question.mark}
                disabled={is2Mark}
                type="number"
                sx={{ ml: 2, mb: 2 }}
              />
              <CustomVditor
                id={`question-${question.id}`}
                value={question.question}
                vd={vQuestion}
                setVd={vSetQuestion}
                className={"flex"}
                location="endsem"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {!loading ? <Button type="submit">Update</Button> : "Loading..."}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
