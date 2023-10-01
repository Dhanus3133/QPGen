import { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
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
import { createEndSemQuestionMutation } from "@/src/graphql/mutations/createEndSemQuestion";
import { endSemQuestionsQuery } from "@/src/graphql/queries/endSemQuestions";

export default function AddQuestion({ subjectCode, subject, currentQuestion }) {
  const [open, setOpen] = useState(false);
  const [vQuestion, vSetQuestion] = useState(null);
  const [createEndSemQuestion, { data, loading }] = useMutation(
    createEndSemQuestionMutation,
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

  const handleCreateQuestion = (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);
    createEndSemQuestion({
      variables: {
        subject: subject,
        part: parseInt(currentQuestion.part),
        number: parseInt(currentQuestion.number),
        roman: parseInt(currentQuestion.roman),
        option: parseInt(dataForm.get("option")),
        mark: parseInt(dataForm.get("mark")) || currentQuestion.mark,
        question: vQuestion.getValue(),
      },
    });
  };

  useEffect(() => {
    if (data?.createEndSemQuestion?.id && open) {
      console.log(data?.createEndSemQuestion?.id);
      handleClose();
    }
  }, [data]);

  return (
    <>
      <Button onClick={handleOpen} color="success">
        <AiOutlinePlusCircle />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "95%", maxHeight: "85vh" } }}
        maxWidth="false"
        disableBackdropClick
      >
        <Box component="form" noValidate onSubmit={handleCreateQuestion}>
          <DialogTitle>
            Add Question - ({currentQuestion.number}
            {getPart(currentQuestion.roman - 1)})
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ pb: 1 }}>
              New Question - {currentQuestion.number})
              {currentQuestion.part !== 1 &&
                ` ${getPart(currentQuestion.roman - 1)}.`}
            </DialogContentText>
            <Box sx={{ pt: 1 }}>
              <FormControl style={{ minWidth: 120 }}>
                <InputLabel id="option-select-label">Option</InputLabel>
                <Select
                  id="add-option"
                  name="option"
                  defaultValue={currentQuestion.option + 1}
                  label="Option"
                  disabled={currentQuestion.part === 1}
                  required
                >
                  <MenuItem value={1}>i</MenuItem>
                  <MenuItem value={2}>ii</MenuItem>
                  <MenuItem value={3}>iii</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="add-mark"
                name="mark"
                label="Mark"
                variant="outlined"
                inputProps={{ min: 2 }}
                disabled={currentQuestion.part === 1}
                type="number"
                sx={{ ml: 2, mb: 2 }}
                required
              />
              <CustomVditor
                id={`question-${currentQuestion.id}`}
                value={""}
                vd={vQuestion}
                setVd={vSetQuestion}
                className={"flex"}
                location="endsem"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {!loading ? <Button type="submit">Create</Button> : "Loading..."}
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
