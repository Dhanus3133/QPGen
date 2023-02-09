import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import styles from "styles/Navbar.module.css";
import Logo from "./Logo";
import LogoDark from "./LogoDark";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { isAuthorizedQuery } from "@/src/graphql/queries/isAuthorized";
import { logoutMutation } from "@/src/graphql/mutations/logout";

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
    client.refetchQueries({ include: "all" });
    Router.push("/");
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsDark(
      globalThis?.window?.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  return (
    <div id="navbar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ backgroundColor: "#333333" }}>
            <AiOutlineArrowLeft
              onClick={() => router.back()}
              className="logo mr-3"
            />
            <Typography
              className={styles.logo}
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <LogoDark />
            </Typography>
            {auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Link href="/">
                    <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                  </Link>
                  {authorized ? (
                    <Link href="/login">
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <MenuItem onClick={handleClose}>Login</MenuItem>
                    </Link>
                  )}
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
