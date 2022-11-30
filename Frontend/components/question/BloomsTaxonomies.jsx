import { bloomsTaxonomiesQuery } from "@/src/graphql/queries/bloomsTaxonomies";
import { useQuery } from "@apollo/client";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

export default function BloomsTaxonomies({ btl, setBtl }) {
  const { data, loading, error } = useQuery(bloomsTaxonomiesQuery);
  const [btls, setBtls] = useState([]);

  useEffect(() => {
    setBtls(data?.bloomsTaxonomyLevels);
  }, [data]);

  if (loading) return "Loading...";

  if (error) return <p>Error: {error.message}</p>;

  return (
    btls && (
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="btl-label">BTL</InputLabel>
        <Select
          labelId="btl-label"
          id="btl"
          autoWidth
          label="Blooms Taxonomy Level"
          value={btl ? btl : ""}
          onChange={(e) => setBtl(e.target.value)}
          required
        >
          {btls.map((btl) => {
            return (
              <MenuItem key={btl["id"]} value={btl["id"]}>
                {btl["name"]} - {btl["description"]}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    )
  );
}
