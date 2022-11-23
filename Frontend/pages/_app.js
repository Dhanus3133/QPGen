import "../styles/globals.css";
import '../styles/trial.css'

import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo-client";
// import { AuthProvider } from "../lib/auth.js";

export default function MyApp({ Component, pageProps }) {
  // <AuthProvider>
  // </AuthProvider>
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
