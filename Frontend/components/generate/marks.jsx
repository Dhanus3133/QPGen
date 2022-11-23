import { Button, Checkbox, TextField } from "@mui/material";
import { useState } from "react";

function Marks({
  marks,
  setMarks,
  counts,
  setCounts,
  choices,
  setChoices,
  valid,
  setValid,
}) {
  const [total, setTotal] = useState(50);

  let num = 0;

  for (let i = 0; i < marks.length; i++) {
    if (marks[i] === null || counts[i] === null) {
      num = Infinity;
      break;
    }
    num += marks[i] * counts[i];
  }

  if (num === total && !valid) {
    setValid(true);
  }

  if (num !== total && valid) {
    setValid(false);
  }

  return (
    <>
      <div className="text-center">
        <TextField
          id="total-marks"
          key="total"
          label="Total Marks"
          type="number"
          variant="outlined"
          defaultValue={total}
          InputProps={{
            inputProps: { min: 1 },
          }}
          onChange={(e) => {
            const val = e.target.value;
            setTotal(val ? parseInt(val) : null);
          }}
        />
      </div>
      <ul>
        {marks.map((mark, idx) => {
          return (
            <div key={idx} className="p-3 pl-0">
              <TextField
                id={`${idx}-mark`}
                key={`mark-${marks[idx]}`}
                label="Mark"
                type="number"
                variant="outlined"
                defaultValue={marks[idx]}
                InputProps={{
                  inputProps: { min: 1 },
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  marks[idx] = val ? parseInt(val) : null;
                  setMarks([...marks]);
                }}
              />
              <TextField
                id={`${idx}-count`}
                key={`count-${counts[idx]}`}
                label="Count"
                type="number"
                variant="outlined"
                defaultValue={counts[idx]}
                InputProps={{
                  inputProps: { min: 1 },
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  counts[idx] = val ? parseInt(val) : null;
                  setCounts([...counts]);
                }}
              />
              <Checkbox
                checked={choices[idx]}
                onChange={(e) => {
                  choices[idx] = e.target.checked;
                  setChoices([...choices]);
                }}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  console.log(idx);
                  marks.splice(idx, 1);
                  counts.splice(idx, 1);
                  choices.splice(idx, 1);
                  setMarks([...marks]);
                  setCounts([...counts]);
                  setChoices([...choices]);
                }}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </ul>
      <div className="text-center">
        <Button
          variant="outlined"
          onClick={() => {
            setMarks([...marks, null]);
            setCounts([...counts, 1]);
            setChoices([...choices, true]);
          }}
        >
          Add
        </Button>
      </div>
    </>
  );
}

export default Marks;
