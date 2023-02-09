import { client } from "@/lib/apollo-client";
import { loginMutation } from "@/src/graphql/mutations/login";
import { logoutMutation } from "@/src/graphql/mutations/logout";
import { useQuery, useMutation } from "@apollo/client";
// import { getCookie, hasCookie } from "cookies-next";
import Router from "next/router";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { isAuthorizedQuery } from "@/src/graphql/queries/isAuthorized";

export default function SignIn() {
  const [authorized, setAuthorized] = useState(false);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [Login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(loginMutation);
  const { data: isAuthorized } = useQuery(isAuthorizedQuery);

  useEffect(() => {
    if (isAuthorized?.isAuthorized) setAuthorized(isAuthorized?.isAuthorized);
  }, [isAuthorized]);

  useEffect(() => {
    if (loginData) {
      setAuthorized(true);
      client.refetchQueries({ include: "all" });
    }
  }, [loginData]);

  function onSubmit(e) {
    e.preventDefault();
    Login({ variables: { email: email, password: password } });
    client.refetchQueries({ include: "active" });
  }

  if (authorized) {
    console.log(authorized);
    Router.push("/");
  }

  return (
    <div className={`flex flex-col justify-center items-center`}>
      <div className="bg-[#3f51b5] w-3/12 px-6 pb-6 mt-14 rounded-2xl flex flex-col justify-center items-center shadow-[0_20px_260px_5px_rgba(99,102,241,0.3)] border-4 border-blue-800">
        <div>
          <h1 className="dark:text-white text-white text-6xl font-bold mt-8 max-w-lg text-center tracking-wide leading-snug ">
            Login to QPGen
          </h1>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col items-center mt-10">
          <input
            type="text"
            placeholder="E-mail"
            onChange={(e) => setemail(e.target.value.trim())}
            className="mb-3 w-full rounded-lg h-12 p-4 text-2xl focus:border-blue-800 focus:outline-none focus:border-[3px]"
          ></input>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value.trim())}
            className="mb-6 w-full rounded-lg h-12 p-4 text-2xl focus:border-blue-800 focus:outline-none focus:border-[3px]"
          ></input>
          <button
            type="submit"
            className="transition ease-in delay-150 w-4/5 bg-gray-900 rounded-md text-[#3f51b5] h-12 text-xl font-semibold text-center items-center mb-3 hover:bg-black hover:text-white hover:scale-105 duration-200"
          >
            Sign In
          </button>
        </form>
        {/* <button onClick={() => logOut()} className="transition ease-in delay-150 w-80 bg-gray-900 rounded-md text-[#3f51b5] font-semibold h-12 text-xl text-center items-center hover:bg-black hover:text-white hover:scale-105 duration-200">Log Out</button> */}
      </div>
    </div>
  );
}
