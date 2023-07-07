import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "apollo-link-error";
import Router from "next/router";

const isServer = typeof window === "undefined";
const windowApolloState = !isServer && window.__NEXT_DATA__.apolloState;

let CLIENT;

const errorLink = onError(({ networkError }) => {
  if (networkError) {
    if (networkError.statusCode === 401) {
      Router.push("/login");
    }
  }
});

export function getApolloClient(forceNew) {
  if (!CLIENT || forceNew) {
    const link = new createHttpLink({
      uri: "/graphql/",
    });

    CLIENT = new ApolloClient({
      // ssrMode: isServer,
      link: errorLink.concat(link),
      cache: new InMemoryCache().restore(windowApolloState || {}),
    });
  }

  return CLIENT;
}

export const client = getApolloClient();
