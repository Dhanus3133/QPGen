import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { allUsersQuery } from "../src/graphql/queries/users";

import List from "../components/List";

export default function IndexPage() {
  const { data, loading, error } = useQuery(allUsersQuery, { ssr: true });
  // On page load, the `networkStatus` should be NetworkStatus.ready ( `7` ) if the data is in the cache, and the page should not need to re-render.
  const [cached, setCached] = useState(true);
  useEffect(() => {
    if (loading) setCached(false);
  }, [loading]);

  if (loading) return "Loading...";

  console.log(data?.users);
  console.log(data);
  // console.log(data?.users.map);
  return (
    <div>
      <Link href="/dashboard">
        <h1 className="text-3xl font-bold cursor-pointer">Dashboard</h1>
      </Link>
      <p>
        This page's data was fetched on the{" "}
        <strong>{cached ? "Next.js server" : "client"}</strong>.{" "}
      </p>
      <List data={data?.users} />
    </div>
  );
}
