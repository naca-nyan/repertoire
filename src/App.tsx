import React, { useState } from "react";
import "./App.css";
import {
  AppBar,
  Button,
  List,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";

import { LibraryMusic } from "@mui/icons-material";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SongPage from "./SongPage";

const TopPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ pt: 2 }}>
    <Typography variant="h1">Top Page</Typography>
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

interface User {
  username: string;
}

function App() {
  const [user, setUser] = useState<null | User>(null);

  function handleLogin() {
    setUser({ username: "naca-nyan" });
  }

  function handleLogout() {
    setUser(null);
  }

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
            なかんにゃの知っとる曲
          </Typography>
          {user === null ? (
            <Button color="inherit" onClick={handleLogin}>
              Log in
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          )}
        </Toolbar>
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
