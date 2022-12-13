import { previousYearsQuery } from "@/src/graphql/queries/previousYears";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";

export default function PreviousYears({ previousYears, setPreviousYears }) {
  const { data, loading, error } = useQuery(previousYearsQuery);
  const [allPreviousYears, setAllPreviousYears] = useState([]);

  useEffect(() => {
    setAllPreviousYears(data?.previousYears);
  }, [data]);

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  const month = {
    MONTH_AM: "A/M",
    MONTH_ND: "N/D",
  };

  return (
    allPreviousYears && (
      <Stack spacing={3} sx={{ width: "28rem" }}>
        <Autocomplete
          multiple
          id="previousyears"
          options={allPreviousYears}
          value={previousYears ? previousYears : []}
          isOptionEqualToValue={(option, value) => option["id"] === value["id"]}
          getOptionLabel={(option) =>
            month[option["month"]] + " " + option["year"]
          }
          filterSelectedOptions
          onChange={(e, t) => setPreviousYears([...t])}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Previous Years"
              placeholder="Previous Years"
            />
          )}
        />
      </Stack>
    )
  );
}
