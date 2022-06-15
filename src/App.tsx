import React from "react";
import "./App.css";
import {
  AppBar,
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

function App() {
  return (
    <div className="App">
      <AppBar position="relative">
        <Toolbar>
          <LibraryMusic sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography variant="h6" color="inherit" noWrap>
            なかんにゃの知っとる曲
          </Typography>
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
