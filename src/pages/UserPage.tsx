import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { watchSongsByScreenName, SongEntry } from "../data/song";
import SongList from "../components/SongList";
import SearchBar from "../components/SearchBar";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import StarButton from "../components/StarButton";

function filterSongs(songEntries: SongEntry[], filter: string): SongEntry[] {
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
  screenName: string;
  data: SongEntry[];
}> = ({ screenName, data }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState("");
  const filtered = filter ? filterSongs(data, filter) : data;
  return (
    <>
      <Stack direction="row">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          @{screenName} さんの知ってる曲
        </Typography>
        <Button
          onClick={() => setCollapsed(!collapsed)}
          sx={{ textAlign: "right" }}
        >
          {collapsed ? "Open" : "Close"} All
        </Button>
      </Stack>
      <Box sx={{ marginTop: 1, marginBottom: 2 }}>
        <SearchBar onInput={(v) => setFilter(v)} />
      </Box>
      <SongList data={filtered} collapsed={collapsed} songAction={StarButton} />
      {filtered.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <Typography>曲がありません</Typography>
        </div>
      )}
    </>
  );
};

const SongPage: React.FC = () => {
  const { screenName } = useParams();
  const [data, setData] = useState<undefined | null | SongEntry[]>(undefined);

  useEffect(() => {
    if (!screenName) {
      setData(null);
      return;
    }
    watchSongsByScreenName(screenName, setData).catch((e) => {
      console.warn(e);
      setData(null);
    });
  }, [screenName]);

  if (!screenName) return <NotFoundPage />;
  if (data === undefined) return <LoadingPage />;
  if (data === null) return <NotFoundPage />;

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <SongPageContent screenName={screenName} data={data} />
    </Container>
  );
};
export default SongPage;
