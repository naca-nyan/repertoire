import React, { useContext, useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { LibraryMusic } from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";
import { UserStateContext } from "../contexts/user";
import { signIn, signOut } from "../auth";
import { UserInfo } from "../data/user";

const AvatarMenu: React.FC<{ user: UserInfo; signOut: () => void }> = ({
  user,
  signOut,
}) => {
  const photoURL = user.photoURL;
  const name = user.displayName ?? "Anonymous";

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        {photoURL ? (
          <Avatar alt={name} src={photoURL} />
        ) : (
          <Avatar alt={name}>{name[0]}</Avatar>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        keepMounted
      >
        <Link to="/mypage" style={{ color: "black", textDecoration: "none" }}>
          <MenuItem onClick={handleCloseUserMenu}>Mypage</MenuItem>
        </Link>
        <MenuItem onClick={signOut}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const AppContainer: React.FC = () => {
  const us = useContext(UserStateContext);

  return (
    <div className="App">
      <AppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar>
            <LibraryMusic sx={{ display: "flex", mr: 1 }} />
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                display: "flex",
                flexGrow: 1,
              }}
            >
              <Typography variant="h6" noWrap>
                Repertoire
              </Typography>
            </Link>
            {us.state === "loading" ? (
              <CircularProgress color="inherit" />
            ) : us.state === "signedOut" ? (
              <Button color="inherit" onClick={signIn}>
                Log in
              </Button>
            ) : (
              <AvatarMenu user={us.user} signOut={signOut} />
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppContainer;
