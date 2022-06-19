import React, { useState } from "react";
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
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { auth, provider } from "./firebase";
import { signInWithRedirect, signOut, User } from "firebase/auth";

import TopPage from "./pages/TopPage";
import SongPage from "./SongPage";
import MyPage from "./pages/MyPage";

const NotFoundPage: React.FC = () => (
  <Typography variant="h2" sx={{ pt: 2 }}>
    There's nothing here!
  </Typography>
);

const AvatarMenu: React.FC<{ user: User; handleLogout: () => void }> = ({
  user,
  handleLogout,
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
          <MenuItem>Mypage</MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | User>(null);

  function handleLogin() {
    signInWithRedirect(auth, provider);
  }

  function handleLogout() {
    signOut(auth).then(() => setUser(null));
  }

  auth.onAuthStateChanged((user) => {
    setLoading(false);
    setUser(user);
  });

  return (
    <div className="App">
      <BrowserRouter>
        <AppBar position="relative">
          <Container maxWidth="lg">
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
              {loading ? (
                <CircularProgress color="inherit" />
              ) : user === null ? (
                <Button color="inherit" onClick={handleLogin}>
                  Log in
                </Button>
              ) : (
                <AvatarMenu user={user} handleLogout={handleLogout} />
              )}
            </Toolbar>
          </Container>
        </AppBar>
        <main>
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/songs" element={<SongPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
