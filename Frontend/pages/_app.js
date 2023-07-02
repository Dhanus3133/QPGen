import "../styles/globals.css";
import "../styles/trial.css";

import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo-client";
import Navbar from "components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
