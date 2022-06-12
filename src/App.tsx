import React, { useState } from "react";
import "./App.css";
import {
  AppBar,
  Box,
  Button,
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

interface Song {
  artist: string;
  title: string;
  url: string;
}

function makeSong(obj: Partial<Song>): Song {
  return {
    artist: obj.artist ?? "",
    title: obj.title ?? "",
    url: obj.url ?? "",
  };
}

function songMap(data: Song[]): Map<string, Song[]> {
  const map = data.reduce((map, obj) => {
    const song = makeSong(obj);
    const songs = map.get(song.artist) ?? [];
    map.set(song.artist, [...songs, song]);
    return map;
  }, new Map());
  return map;
}
function SongListAll() {
  const [searchWord, setSearchWord] = useState("");
  const filtered = searchWord
    ? data.filter(
        ({ artist, title, url }) =>
          artist.includes(searchWord) || title.includes(searchWord)
      )
    : data;
  const songsOf = songMap(filtered);
  const sorted = Array.from(songsOf.entries());

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
        </ListSubheader>
      }
    >
      {sorted.map(([k, v]) => (
        <SongList key={k} artist={k} songs={v} open={!collapsed}></SongList>
      ))}
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
