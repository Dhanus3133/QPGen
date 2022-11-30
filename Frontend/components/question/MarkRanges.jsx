import { markRangesQuery } from "@/src/graphql/queries/markRanges";
import { useQuery } from "@apollo/client";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

export default function MarkRanges({ markRange, setMarkRange }) {
  const { data, loading, error } = useQuery(markRangesQuery);
  const [markRanges, setMarkRanges] = useState([]);

  useEffect(() => {
    setMarkRanges(data?.markRanges);
  }, [data]);

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  return (
    markRanges && (
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="markrange-label">Mark</InputLabel>
        <Select
          labelId="markrange-label"
          id="markrange"
          autoWidth
          label="Mark Range"
          value={markRange ? markRange : ""}
          onChange={(e) => setMarkRange(e.target.value)}
          required
        >
          {markRanges.map((mark) => {
            return (
              <MenuItem key={mark["id"]} value={mark["id"]}>
                {mark["start"]} - {mark["end"]}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    )
  );
}
