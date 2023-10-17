import { regulationsQuery } from "@/src/graphql/queries/regulations";
import { useQuery } from "@apollo/client";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

export default function Regulation({ regulation, setRegulation }) {
  const { data, loading, error } = useQuery(regulationsQuery);
  const [regulations, setRegulations] = useState([]);

  useEffect(() => {
    setRegulations(data?.regulations);
  }, [data]);

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  return (
    regulations && (
      <FormControl sx={{ m: 1, minWidth: 80, width: 240 }}>
        <InputLabel id="regulation-label">Regulation</InputLabel>
        <Select
          labelId="regulations-label"
          id="regulation"
          autoWidth
          label="Regulation"
          value={regulation ? regulation : ""}
          onChange={(e) => setRegulation(e.target.value)}
          required
        >
          {regulations.map((reg) => {
            return (
              <MenuItem key={reg["id"]} value={reg["id"]}>
                {reg["year"]}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    )
  );
}
