import { useQuery } from "@apollo/client";
import { examMarksQuery } from "@/src/graphql/queries/examMarks";
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
  setExam,
  setIsSem,
  examTitle,
  setExamTitle,
}) {
  const { data, loading, error } = useQuery(examMarksQuery);

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

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
      <Autocomplete
        id="type"
        options={data?.examMarks}
        onChange={(_, type) => {
          if (type) {
            setExam(parseInt(type["exam"]["id"]));
            setExamTitle(type["exam"]["name"]);
            setMarks(type["marks"]);
            setCounts(type["counts"]);
            setChoices(type["choices"]);
            setUnits(type["units"]);
            setTime(type["time"]);
            setTotal(type["total"]);
            setIsSem(type["isEndSemFormat"]);
          } else {
            setExamTitle(null);
            setMarks([]);
            setCounts([]);
            setChoices([]);
            setUnits([]);
            setTime(null);
            setTotal(null);
            setIsSem(false);
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
                      const updatedMarks = [...marks];
                      updatedMarks[idx] = val ? parseInt(val) : null;
                      setMarks(updatedMarks);
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
                      const updatedCounts = [...counts];
                      updatedCounts[idx] = val ? parseInt(val) : null;
                      setCounts(updatedCounts);
                    }}
                  />
                  <Checkbox
                    checked={choices[idx]}
                    onChange={(e) => {
                      const updatedChoices = [...choices];
                      updatedChoices[idx] = e.target.checked;
                      setChoices(updatedChoices);
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      const updatedMarks = [...marks];
                      updatedMarks.splice(idx, 1);

                      const updatedCounts = [...counts];
                      updatedCounts.splice(idx, 1);

                      const updatedChoices = [...choices];
                      updatedChoices.splice(idx, 1);

                      setMarks(updatedMarks);
                      setCounts(updatedCounts);
                      setChoices(updatedChoices);
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
