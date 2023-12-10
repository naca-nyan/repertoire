import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import {
  Box,
  Button,
  Container,
  Divider,
  Input,
  ListSubheader,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

import { getSongsByScreenName, SongEntries } from "../data/song";
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

function filterSongs(songEntries: SongEntries, filter: string): SongEntries {
  const filterLowerCase = filter.toLowerCase();
  const filteredEntries = songEntries.filter((songEntry) => {
    const [, { title, artist }] = songEntry;
    const titleLowerCase = title.toLowerCase();
    const artistLowerCase = artist.toLowerCase();
    return (
      titleLowerCase.includes(filterLowerCase) ||
      artistLowerCase.includes(filterLowerCase)
    );
  });
  return filteredEntries;
}

const SongPageContent: React.FC<{
  data: SongEntries;
}> = ({ data }) => {
  const [searchWord, setSearchWord] = useState("");
  const [debouncedSearchWord, setDebouncedSearchWord] = useState("");
  useDebounce(() => setDebouncedSearchWord(searchWord), 300, [searchWord]);

  const [collapsed, setCollapsed] = useState(false);

  const subheader = SongListSubHeader({
    collapsed,
    onChangeSearchWord: (e) => setSearchWord(e.currentTarget.value),
    onClickToggleButton: () => setCollapsed(!collapsed),
  });
  const filter = debouncedSearchWord;
  const filtered = filter ? filterSongs(data, filter) : data;
  return (
    <Paper elevation={3} sx={{ mt: 2 }}>
      <SongList data={filtered} collapsed={collapsed} subheader={subheader} />
    </Paper>
  );
};

const SongPage: React.FC = () => {
  const { screenName } = useParams();
  const [data, setData] = useState<undefined | null | SongEntries>(undefined);

  useEffect(() => {
    if (!screenName) {
      setData(null);
      return;
    }
    getSongsByScreenName(screenName)
      .then(setData)
      .catch((e) => {
        console.warn(e);
        setData(null);
      });
  }, [screenName]);

  if (!screenName) return <NotFoundPage />;
  if (data === undefined) return <LoadingPage />;
  if (data === null) return <NotFoundPage />;

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography variant="h6">@{screenName} さんの知ってる曲</Typography>
      <SongPageContent data={data} />
    </Container>
  );
};
export default SongPage;
