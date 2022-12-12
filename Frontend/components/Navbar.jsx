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
import styles from "styles/Navbar.module.css";
import Logo from "./Logo";
import LogoDark from "./LogoDark";
import { useEffect } from "react";

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false);

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
    setIsDark(globalThis?.window?.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  // <FormGroup>
  //   <FormControlLabel
  //     control={
  //       <Switch
  //         checked={auth}
  //         onChange={handleChange}
  //         aria-label="login switch"
  //       />
  //     }
  //     label={auth ? "Logout" : "Login"}
  //   />
  // </FormGroup>
  return (
    <div id="navbar">
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <AppBar position="static">
          <Toolbar sx={{backgroundColor: "#333333"}}>
            <AiOutlineArrowLeft
              onClick={() => router.back()}
              className="logo mr-6"
              size="1.8em"
            />
            {isDark ? <LogoDark /> : <LogoDark />}
            {/* <Typography
              className={styles.logo}
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "#3f51b5"}}
            >
              QPGen
            </Typography> */}
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
                  <Link href="/dashboard">
                    <MenuItem onClick={handleClose}>Dashboard</MenuItem>
                  </Link>
                  <Link href="/login">
                    <MenuItem onClick={handleClose}>Login</MenuItem>
                  </Link>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
// import Link from "next/link";
//
// export default function Navbar() {
//   let navbar = [
//     ["Dashboard", "/dashboard"],
//     ["Login", "/login"],
//   ].map(([title, url]) => (
//     <Link
//       href={url}
//       className="rounded-lg px-3 py-2 text-slate-100 font-medium hover:bg-slate-100 hover:text-slate-900"
//       key={title}
//     >
//       {title}
//     </Link>
//   ));
//   return (
//     <div>
//       <nav className="flex sm:justify-center h-20 space-x-4 items-center bg-slate-700">
//         {navbar}
//       </nav>
//     </div>
//   );
// }
