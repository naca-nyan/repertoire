import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import LoadingPage from "./LoadingPage";
import { getSongs, setSongs, Song } from "../data/song";
import SongList from "../components/SongList";
import SongSubmitForm from "../components/SongSubmitForm";
import { UserStateContext } from "../contexts/user";
import UnauthorizedPage from "./UnauthorizedPage";
import ErrorPage from "./ErrorPage";
import { Share } from "@mui/icons-material";
import { getScreenName } from "../data/user";

const MyPage: React.FC = () => {
  const us = useContext(UserStateContext);
  const [data, setData] = useState<undefined | Song[]>(undefined);

  if (us.state === "loading") {
    return <LoadingPage />;
  }
  if (us.state === "signed out") {
    return <UnauthorizedPage />;
  }

  const user = us.user;
  const userId = getScreenName(user);
  if (!userId) {
    return <ErrorPage />;
  }

  if (data === undefined) {
    getSongs(userId).then((data) => {
      if (data === null) {
        console.warn("fetched data null; fall back to []");
      }
      const songs = data ?? [];
      setData(songs);
    });
    return <LoadingPage />;
  }

  function handleSave() {
    const songs = data;
    if (!userId || songs === undefined) {
      console.error("handleSave: cannot save", userId, songs);
      return;
    }
    setSongs(userId, songs);
  }

  const shareURL = window.location.origin + "/users/" + userId;

  function copyShareURL() {
    navigator.clipboard.writeText(shareURL);
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">
          {user.displayName}の知ってる曲リスト
          <Tooltip title={shareURL}>
            <IconButton onClick={copyShareURL} sx={{ ml: 1 }}>
              <Share />
            </IconButton>
          </Tooltip>
        </Typography>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </Box>
      <Paper elevation={3} sx={{ mt: 2 }}>
        <List component="nav" dense>
          <SongList data={data} filter="" collapsed={false} />
        </List>
      </Paper>
      <SongSubmitForm onAddSong={(song) => setData([...data, song])} />
    </Container>
  );
};

export default MyPage;
