import { Autocomplete, Button, Checkbox, TextField } from "@mui/material";

function Marks({
  marks,
  setMarks,
  counts,
  setCounts,
  choices,
  setChoices,
  total,
  setTotal,
  setUnits,
  setTime,
  valid,
  setValid,
  examTitle,
  setExamTitle,
}) {
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

  const types = [
    {
      label: "Internal Assessment 1",
      total: 50,
      marks: [2, 12, 16],
      counts: [5, 2, 1],
      choices: [false, true, true],
      units: [1],
      time: "1.30",
    },
    {
      label: "Internal Assessment 2",
      total: 50,
      marks: [2, 12, 16],
      counts: [5, 2, 1],
      choices: [false, true, true],
      units: [2, 3],
      time: "1.30",
    },
    {
      label: "Model Exam",
      total: 100,
      marks: [2, 16],
      counts: [10, 5],
      choices: [false, true],
      units: [1, 2, 3, 4, 5],
      time: "3",
    },
    {
      label: "Custom",
      total: null,
      marks: [],
      counts: [],
      choices: [],
      units: [],
      time: null,
    },
  ];

  return (
    <>
      <Autocomplete
        id="type"
        options={types}
        onChange={(_, type) => {
          if (type) {
            setExamTitle(type["label"]);
            setMarks(type["marks"]);
            setCounts(type["counts"]);
            setChoices(type["choices"]);
            setUnits(type["units"]);
            setTime(type["time"]);
            setTotal(type["total"]);
          } else {
            setExamTitle(null);
            setMarks([]);
            setCounts([]);
            setChoices([]);
            setUnits([]);
            setTime(null);
            setTotal(null);
          }
        }}
        getOptionLabel={(option) => {
          return option["label"];
        }}
        sx={{ width: 400 }}
        renderInput={(params) => <TextField {...params} label="Exam" />}
      />
      {examTitle && (
        <>
          <div className="text-center">
            <TextField
              id="total-marks"
              key="total"
              label="Total Marks"
              type="number"
              variant="outlined"
              value={total}
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
            {marks.map((_, idx) => {
              return (
                <div key={idx} className="p-3 pl-0">
                  <TextField
                    id={`${idx}-mark`}
                    key={`mark-${idx}`}
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
                    key={`count-${idx}`}
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
      )}
    </>
  );
}

export default Marks;
