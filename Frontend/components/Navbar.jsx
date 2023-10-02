import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AiOutlineArrowLeft, AiFillHome } from "react-icons/ai";
import { BiBook } from "react-icons/bi";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { isAuthorizedQuery } from "@/src/graphql/queries/isAuthorized";
import { logoutMutation } from "@/src/graphql/mutations/logout";
import { Button } from "@mui/material";
import EndSemFacultyOnly from "components/endsem/EndSemFacultyOnly";

export default function MenuAppBar() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const { data: isAuthorized, loading } = useQuery(isAuthorizedQuery);
  const [LogoutMutation, { data }] = useMutation(logoutMutation);

  useEffect(() => {
    if (!loading) {
      if (isAuthorized?.isAuthorized) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        if (
          router.pathname !== "/signup" &&
          !router.pathname.startsWith("/verify/")
        ) {
          Router.push("/login");
        }
      }
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (data?.logout) {
      client.refetchQueries({ include: "active" });
      router.push("/login");
    }
  }, [data]);

  const handleLogout = () => {
    LogoutMutation();
  };

  return (
    <div id="navbar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ backgroundColor: "#333333" }}>
            <AiOutlineArrowLeft
              onClick={() => router.back()}
              className="mr-4"
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, mt: 1 }}
            >
              <img src="/cit-logo.png" alt="CIT" width="220" height="40" />
            </Typography>
            {authorized && (
              <>
                <Link href="/">
                  <Button color="inherit">
                    {" "}
                    <AiFillHome className="mr-2" />
                    Home
                  </Button>
                </Link>
                <EndSemFacultyOnly errorDisplay={false}>
                  <Link href="/endsem">
                    <Button color="inherit">
                      {" "}
                      <BiBook className="mr-2" />
                      EndSem
                    </Button>
                  </Link>
                </EndSemFacultyOnly>
                <Link href="/login">
                  <Button color="inherit" onClick={handleLogout}>
                    <FaSignOutAlt />
                  </Button>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
