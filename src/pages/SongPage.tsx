import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import {
  Box,
  Button,
  Container,
  Divider,
  Input,
  List,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

import { getSongs, Song } from "../data/song";
import SongList from "../components/SongList";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";

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

const SongListWithSearchBar: React.FC<{ data: Song[] }> = ({ data }) => {
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
    <Paper elevation={3} sx={{ mt: 2 }}>
      <List component="nav" dense subheader={subheader}>
        <SongList
          data={data}
          filter={debouncedSearchWord}
          collapsed={collapsed}
        />
      </List>
    </Paper>
  );
};

const SongPage: React.FC = () => {
  const { userId } = useParams();
  const [data, setData] = useState<undefined | null | Song[]>(undefined);

  if (!userId) return <NotFoundPage />;
  if (data === undefined) {
    getSongs(userId).then(setData);
    return <LoadingPage />;
  }
  if (data === null) {
    return <NotFoundPage />;
  }
  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography variant="h6">@{userId} さんの知ってる曲</Typography>
      <SongListWithSearchBar data={data} />
    </Container>
  );
};
export default SongPage;
