import "../styles/globals.css";

// import { ApolloProvider } from "@apollo/client";
// import { client } from "../lib/apollo-client";
import { AuthProvider } from "../lib/auth.js";

export default function MyApp({ Component, pageProps }) {
  return (
    // <ApolloProvider client={client}>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    // </ApolloProvider>
  );
}
