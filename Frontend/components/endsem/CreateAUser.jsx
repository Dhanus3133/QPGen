import { useState } from "react";
import { useMutation } from "@apollo/client";
import { createUserForSubjectMutation } from "@/src/graphql/mutations/createUserForSubject";
import { Button, Alert } from "@mui/material";

export default function CreateUser({ subject }) {
  const [password, setPassword] = useState(null);
  const [createUserForSubject, { data, loading, error }] = useMutation(
    createUserForSubjectMutation,
  );

  function handleCreateUserForSubject() {
    const password = Math.random().toString(36).slice(-10);
    setPassword(password);
    createUserForSubject({
      variables: {
        subject: subject,
        password: password,
      },
    });
  }

  return (
    <>
      {data?.createUserForSubject?.id && (
        <Alert sx={{ mt: 3, mb: 2 }} variant="filled" severity="success">
          <p>Email: {data?.createUserForSubject.email}</p>
          <p>Password: {password}</p>
        </Alert>
      )}
      {data?.createUserForSubject?.messages[0].message && (
        <Alert sx={{ mt: 3, mb: 2 }} variant="filled" severity="error">
          {data?.createUserForSubject?.messages[0].message}
        </Alert>
      )}
      {subject && (
        <Button
          type="submit"
          className="bg-[#1976d2]"
          variant="contained"
          color="primary"
          onClick={handleCreateUserForSubject}
        >
          Create a new User
        </Button>
      )}
    </>
  );
}
