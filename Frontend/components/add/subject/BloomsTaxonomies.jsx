import { bloomsTaxonomiesQuery } from "@/src/graphql/queries/bloomsTaxonomies";
import { useQuery } from "@apollo/client";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function BloomsTaxonomies({ btls, setBtls }) {
  const { data, loading, error } = useQuery(bloomsTaxonomiesQuery);
  const [allBtls, setAllBtls] = useState([]);

  useEffect(() => {
    setAllBtls(data?.bloomsTaxonomyLevels);
  }, [data]);

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  return (
    allBtls && (
      <Autocomplete
        multiple
        id="Outcome BTLs"
        options={allBtls}
        value={btls ? btls : []}
        isOptionEqualToValue={(option, value) => option["id"] === value["id"]}
        getOptionLabel={(option) =>
          option["name"] + " | " + option["description"]
        }
        filterSelectedOptions
        autoHighlight
        onChange={(_, t) => setBtls([...t])}
        renderInput={(params) => (
          <TextField {...params} label="Course RBT" placeholder="Course RBT" />
        )}
      />
    )
  );
}

// <FormControl sx={{ m: 1, minWidth: 80 }}>
//   <InputLabel id="btl-label">BTL</InputLabel>
//   <Select
//     labelId="btl-label"
//     id="btl"
//     autoWidth
//     label="Blooms Taxonomy Level"
//     value={btl ? btl : ""}
//     onChange={(e) => setBtl(e.target.value)}
//     required
//   >
//     {allBtls.map((btl) => {
//       return (
//         <MenuItem key={btl["id"]} value={btl["id"]}>
//           {btl["name"]} - {btl["description"]}
//         </MenuItem>
//       );
//     })}
//   </Select>
// </FormControl>
//
