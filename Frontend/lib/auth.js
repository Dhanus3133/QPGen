import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>
        {children}
      </ApolloProvider>
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [authToken, setAuthToken] = useState(getCookie("token")); // useState(null); //useCookies(["token"]);
  console.log(authToken);

  const isSignedIn = () => {
    if (authToken) {
      return true;
    } else {
      return false;
    }
  };

  const getAuthHeaders = () => {
    if (!authToken) return null;

    return {
      authorization: `Bearer ${authToken}`,
    };
  };

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: "http://qpgen.lol/graphql/",
      headers: getAuthHeaders(),
    });

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  };

  const signIn = async ({ email, password }) => {
    const client = createApolloClient();
    const LoginMutation = gql`
      mutation signIn($email: String!, $password: String!) {
        tokenAuth(input: { email: $email, password: $password }) {
          token {
            token
          }
          errors
        }
      }
    `;

    const result = await client.mutate({
      mutation: LoginMutation,
      variables: { email, password },
    });

    if (result?.data?.tokenAuth?.token?.token) {
      setAuthToken(result?.data?.tokenAuth?.token?.token);
      setCookie("token", result?.data?.tokenAuth?.token?.token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: true,
      });
      client.refetchQueries({ include: "all" });
      // console.log(result?.data?.tokenAuth?.token?.token);
    } else {
      console.log(result?.data?.tokenAuth?.errors);
    }
  };

  const signOut = () => {
    setAuthToken(null);
    deleteCookie("token");
  };

  return {
    setAuthToken,
    isSignedIn,
    signIn,
    signOut,
    createApolloClient,
  };
}
