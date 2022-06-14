import React, { useMemo, useState } from "react";
import "./App.css";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Input,
  List,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";

import data from "./data.json";
import SongList from "./SongList";
import { Search } from "@mui/icons-material";
import { useDebounce } from "react-use";

function SongListAll() {
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord, setDebouncedSearchWord] = useState("");
  useDebounce(() => setDebouncedSearchWord(searchWord), 50, [searchWord]);

  const [collapsed, setCollapseAll] = useState(false);
  return (
    <List
      component="nav"
      dense
      subheader={
        <ListSubheader component="div">
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "flex-end", flexGrow: 1 }}>
              <Search sx={{ my: 0.5, mr: 1 }} />
              <Input
                placeholder="Search..."
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </Box>
            <Button size="small" onClick={() => setCollapseAll(!collapsed)}>
              {collapsed ? "Open" : "Close"} All
            </Button>
          </Toolbar>
          <Divider />
        </ListSubheader>
      }
    >
      <SongList
        data={data}
        filter={debouncedSearchWord}
        collapsed={collapsed}
      />
    </List>
  );
}

function App() {
  return (
    <div className="App">
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            なかんにゃの知っとる曲
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="sm" sx={{ pt: 2 }}>
          <Paper elevation={3}>
            <SongListAll />
          </Paper>
        </Container>
      </main>
    </div>
  );
}

export default App;
