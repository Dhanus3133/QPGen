import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AiOutlineArrowLeft, AiFillHome } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { isAuthorizedQuery } from "@/src/graphql/queries/isAuthorized";
import { logoutMutation } from "@/src/graphql/mutations/logout";
import Image from "next/image";
import { Button } from "@mui/material";

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false);
  const [authorized, setAuthorized] = useState(false);
  const { data: isAuthorized } = useQuery(isAuthorizedQuery);
  const [LogoutMutation] = useMutation(logoutMutation);

  useEffect(() => {
    if (isAuthorized?.isAuthorized) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [isAuthorized]);

  const handleLogout = () => {
    LogoutMutation();
    client.refetchQueries({ include: "active" });
    Router.push("/");
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
              <Image src="/cit-logo.png" alt="CIT" width="220" height="40" />
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
