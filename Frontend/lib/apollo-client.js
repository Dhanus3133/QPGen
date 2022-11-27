import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "apollo-link-error";
import Router from "next/router";

const isServer = typeof window === "undefined";
const windowApolloState = !isServer && window.__NEXT_DATA__.apolloState;

let CLIENT;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
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

      /**
        // Default options to disable SSR for all queries.
        defaultOptions: {
          // Skip queries when server side rendering
          // https://www.apollographql.com/docs/react/data/queries/#ssr
          watchQuery: {
            ssr: false
          },
          query: {
            ssr: false
          }
          // Selectively enable specific queries like so:
          // `useQuery(QUERY, { ssr: true });`
        }
      */
    });
  }

  return CLIENT;
}

export const client = getApolloClient();
