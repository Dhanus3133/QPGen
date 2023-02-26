import { allFacultiesQuery } from "@/src/graphql/queries/faculties";
import { useQuery } from "@apollo/client";
import { Autocomplete, TextField } from "@mui/material";

export default function Faculties({ faculties, setFaculties }) {
  const {
    data: facultiesData,
    loading: facultiesLoading,
    error: facultiesError,
  } = useQuery(allFacultiesQuery);

  if (facultiesLoading) return "Loading...";

  if (facultiesError) return <p>Error: {facultiesError.message}</p>;

  const allFaculties = facultiesData?.faculties;

  return (
    <Autocomplete
      multiple
      id="faculties"
      options={allFaculties}
      value={faculties ? faculties : []}
      isOptionEqualToValue={(option, value) => option["id"] === value["id"]}
      getOptionLabel={(option) => option["fullName"] + " | " + option["email"]}
      filterSelectedOptions
      autoHighlight
      onChange={(_, t) => setFaculties([...t])}
      renderInput={(params) => (
        <TextField {...params} label="Faculties" placeholder="Faculties" />
      )}
    />
  );
}
