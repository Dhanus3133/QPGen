import { client } from "@/lib/apollo-client";
import { loginMutation } from "@/src/graphql/mutations/login";
import { logoutMutation } from "@/src/graphql/mutations/logout";
import { useMutation } from "@apollo/client";
// import { getCookie, hasCookie } from "cookies-next";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [Login, { loginData, loginLoading, loginError }] =
    useMutation(loginMutation);
  const [LogoutMutation, { logoutData, logoutLoading, logoutError }] =
    useMutation(logoutMutation);

  function onSubmit(e) {
    e.preventDefault();
    Login({ variables: { email: email, password: password } });
    client.refetchQueries({ include: "active" });
    Router.push("/");
  }

  function logOut() {
    LogoutMutation();
    Router.push("/login");
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setemail(e.target.value.trim())}
        ></input>
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value.trim())}
        ></input>
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => logOut()}>Log Out</button>
    </div>
  );
}
