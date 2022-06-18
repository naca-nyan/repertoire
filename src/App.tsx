import React, { useState } from "react";
import "./App.css";
import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { LibraryMusic } from "@mui/icons-material";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SongPage from "./SongPage";
import { auth, provider } from "./firebase";
import {
  getRedirectResult,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";

const TopPage: React.FC<{ user: User | null }> = ({ user }) => (
  <Container maxWidth="sm" sx={{ pt: 2 }}>
    {user && <Typography variant="h5">Hello, {user.displayName}!</Typography>}
    <List>
      <ListItemButton>
        <Link to="/">TOP</Link>
      </ListItemButton>
      <ListItemButton>
        <Link to="/songs">Song List</Link>
      </ListItemButton>
    </List>
  </Container>
);

const NotFoundPage: React.FC = () => (
  <Typography variant="h2" sx={{ pt: 2 }}>
    There's nothing here!
  </Typography>
);

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

  function fetchLogin() {
    if (!loading) return;
    getRedirectResult(auth)
      .then((result) => {
        const user = result?.user;
        console.log(user);
        setLoading(false);
        if (user) setUser(user);
      })
      .catch((error) => {
        console.warn(error);
        setLoading(false);
      });
  }

  fetchLogin();

  return (
    <div className="App">
      <AppBar position="relative">
        <Toolbar>
          <LibraryMusic sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ display: "flex", flexGrow: 1 }}
          >
            Repertoire
          </Typography>
          {loading ? (
            <CircularProgress color="inherit" />
          ) : user === null ? (
            <Button color="inherit" onClick={handleLogin}>
              Log in
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              {user.photoURL ? (
                <Avatar alt={user.displayName ?? ""} src={user.photoURL} />
              ) : (
                <Avatar>{(user.displayName ?? "")[0]}</Avatar>
              )}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TopPage user={user} />} />
            <Route path="/songs" element={<SongPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
