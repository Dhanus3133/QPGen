import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { allUsersQuery } from "../src/graphql/queries/users";

import List from "../components/List";

export default function SSR() {
  const { data, loading, error } = useQuery(allUsersQuery, { ssr: true });

  console.log({ loading, error });

  // On page load, the `networkStatus` should be NetworkStatus.ready ( `7` ) if the data is in the cache, and the page should not need to re-render.
  const [cached, setCached] = useState(true);
  useEffect(() => {
    if (loading) setCached(false);
  }, [loading]);

  if (loading) return "Loading...";

  console.log(data?.users);
  // console.log(data?.users.map);
  return (
    <div>
      <p>
        This page's data was fetched on the{" "}
        <strong>{cached ? "Next.js server" : "client"}</strong>.{" "}
      </p>
      <List data={data?.users} />
    </div>
  );
}
      // <h1>{data?.users[3].email}</h1>
      // <List data={data?.users} />
// <h1>{data?.users[3]["email"]}</h1>
// <h2>{data?.jobs}</h2>
