import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { LibraryMusic } from "@mui/icons-material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auth, provider } from "./firebase";
import { signInWithRedirect, signOut, User } from "firebase/auth";

import TopPage from "./pages/TopPage";
import SongPage from "./SongPage";

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
    if (user) {
      setLoading(false);
      setUser(user);
    }
  });

  return (
    <div className="App">
      <AppBar position="relative">
        <Container maxWidth="lg">
          <Toolbar>
            <LibraryMusic sx={{ display: "flex", mr: 1 }} />
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
        </Container>
      </AppBar>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/songs" element={<SongPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
