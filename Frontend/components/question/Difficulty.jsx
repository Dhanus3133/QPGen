import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function Difficulty({ difficulty, setDifficulty }) {
  const difficulties = [
    { id: "DIFFICULTY_EASY", name: "Easy" },
    { id: "DIFFICULTY_MEDIUM", name: "Medium" },
    { id: "DIFFICULTY_HARD", name: "Hard" },
  ];

  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="difficulty-label">Difficulty</InputLabel>
      <Select
        labelId="difficulty-label"
        id="difficulty"
        autoWidth
        label="Difficulty"
        value={difficulty ? difficulty : ""}
        onChange={(e) => setDifficulty(e.target.value)}
        required
      >
        {difficulties.map((difficulty) => {
          return (
            <MenuItem key={difficulty["id"]} value={difficulty["id"]}>
              {difficulty["name"]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
