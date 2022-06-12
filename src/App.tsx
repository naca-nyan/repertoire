import React, { useState } from "react";
import "./App.css";
import {
  AppBar,
  Button,
  List,
  ListSubheader,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";

import data from "./data.json";
import SongList from "./SongList";

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

const songsOf: Map<string, Song[]> = data.reduce((map, obj) => {
  const song = makeSong(obj);
  const songs = map.get(song.artist) ?? [];
  map.set(song.artist, [...songs, song]);
  return map;
}, new Map());

function SongListAll() {
  const sorted = Array.from(songsOf.entries()); //.sort().reverse();

  const [collapsed, setCollapseAll] = useState(false);
  return (
    <List
      component="nav"
      dense
      subheader={
        <ListSubheader>
          <Stack direction="row" justifyContent="right" sx={{ p: 1 }}>
            <Button size="small" onClick={() => setCollapseAll(!collapsed)}>
              {collapsed ? "Open" : "Close"} All
            </Button>
          </Stack>
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
            <SongListAll></SongListAll>
          </Paper>
        </Container>
      </main>
    </div>
  );
}

export default App;
