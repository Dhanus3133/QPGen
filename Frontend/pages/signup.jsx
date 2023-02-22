import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "@apollo/client";
import { signupMutation } from "@/src/graphql/mutations/signup";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

const theme = createTheme();

export default function SignUp() {
  const [Signup, { data, loading, error }] = useMutation(signupMutation);
  const [errors, setErrors] = useState(null);
  console.log(data);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(null);
    const data = new FormData(event.currentTarget);
    Signup({
      variables: {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: data.get("password"),
      },
    }).catch((error) => {
      console.log("Error: " + error);
    });
  };

  if (error && !errors) {
    try {
      setErrors(JSON.parse(error.message.replace(/'/g, '"')));
    } catch (err) {
      console.log(error);
    }
  }
  if (data?.createNewUser) {
    return (
      <>
        <p>Verification Email Sent!</p>
        <Link href="login">Click here to Login!</Link>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="first-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  error={errors?.first_name ? true : false}
                  helperText={errors?.first_name ? errors.first_name : ""}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  error={errors?.last_name ? true : false}
                  helperText={errors?.last_name ? errors.last_name : ""}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  error={errors?.email ? true : false}
                  helperText={errors?.email ? errors.email : ""}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={errors?.password ? true : false}
                  helperText={errors?.password ? errors.password : ""}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            {!loading ? (
              <Button
                className="bg-[#1976d2]"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
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
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={"/login"}>Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
