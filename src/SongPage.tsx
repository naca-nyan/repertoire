import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  List,
  ListSubheader,
  Paper,
  Toolbar,
} from "@mui/material";
import { Container } from "@mui/system";

import data from "./data.json";
import SongList from "./SongList";
import { Search } from "@mui/icons-material";
import { useDebounce } from "react-use";

const SongListSubHeader: React.FC<{
  collapsed: boolean;
  onChangeSearchWord: ChangeEventHandler<HTMLInputElement>;
  onClickToggleButton: MouseEventHandler;
}> = ({ collapsed, onChangeSearchWord, onClickToggleButton }) => {
  return (
    <ListSubheader component="div">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "flex-end", flexGrow: 1 }}>
          <Search sx={{ my: 0.5, mr: 1 }} />
          <Input placeholder="Search..." onChange={onChangeSearchWord} />
        </Box>
        <Button size="small" onClick={onClickToggleButton}>
          {collapsed ? "Open" : "Close"} All
        </Button>
      </Toolbar>
      <Divider />
    </ListSubheader>
  );
};

function SongListAll() {
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord, setDebouncedSearchWord] = useState("");
  useDebounce(() => setDebouncedSearchWord(searchWord), 300, [searchWord]);

  const [collapsed, setCollapsed] = useState(false);

  const subheader = SongListSubHeader({
    collapsed,
    onChangeSearchWord: (e) => setSearchWord(e.currentTarget.value),
    onClickToggleButton: () => setCollapsed(!collapsed),
  });
  return (
    <List component="nav" dense subheader={subheader}>
      <SongList
        data={data}
        filter={debouncedSearchWord}
        collapsed={collapsed}
      />
    </List>
  );
}

const SongPage: React.FC = () => (
  <Container maxWidth="sm" sx={{ pt: 2 }}>
    <Paper elevation={3}>
      <SongListAll />
    </Paper>
  </Container>
);

export default SongPage;
