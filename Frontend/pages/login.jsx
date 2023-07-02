import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { isAuthorizedQuery } from "@/src/graphql/queries/isAuthorized";
import { client } from "@/lib/apollo-client";
import { loginMutation } from "@/src/graphql/mutations/login";
import { useQuery, useMutation } from "@apollo/client";
import Router from "next/router";
import { Alert, CircularProgress } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function SignIn() {
  const [authorized, setAuthorized] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  const { data: isAuthorized } = useQuery(isAuthorizedQuery);

  const [Login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(loginMutation);

  useEffect(() => {
    if (isAuthorized?.isAuthorized) setAuthorized(isAuthorized?.isAuthorized);
  }, [isAuthorized]);

  if (authorized) {
    Router.push("/");
  }

  useEffect(() => {
    if (loginData) {
      setAuthorized(true);
      client.refetchQueries({ include: "all" });
    }
  }, [loginData]);

  if (loginError) {
    const err = loginError.networkError.result.errors[0]?.message;
    if (err !== loginErrorMessage)
      setLoginErrorMessage(loginError.networkError.result.errors[0]?.message);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    Login({
      variables: {
        email: data.get("email").trim(),
        password: data.get("password"),
      },
    }).catch((error) => {
      console.log("Error: " + error);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        {loginErrorMessage && (
          <Alert sx={{ mt: 3, mb: 2 }} variant="filled" severity="error">
            {loginErrorMessage}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {!loginLoading ? (
            <Button
              className="bg-[#1976d2]"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled
            >
              <CircularProgress color="success" />
            </Button>
          )}
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
