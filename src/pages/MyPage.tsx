import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  List,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import LoadingPage from "./LoadingPage";
import { getSongs, pushSong, Song, Songs } from "../data/song";
import SongList from "../components/SongList";
import SongSubmitForm from "../components/SongSubmitForm";
import { UserStateContext } from "../contexts/user";
import UnauthorizedPage from "./UnauthorizedPage";
import { Share } from "@mui/icons-material";
import { User } from "../data/user";

const MyPageContent: React.FC<{
  user: User;
}> = ({ user }) => {
  const userId = user.userId;
  const [data, setData] = useState<undefined | Songs>(undefined);

  useEffect(() => {
    getSongs(userId)
      .then((songs) => setData(songs))
      .catch(() => {
        console.warn("Failed to fetch songs; fallback to []");
        setData([]);
      });
  }, [userId]);

  if (data === undefined) {
    return <LoadingPage />;
  }

  const onAddSong = (song: Song) => {
    pushSong(userId, { ...song, createdAt: Date.now() })
      .then((songId) => setData([...data, [songId, song]]))
      .catch((e) => console.error("cannot push song", song, e));
  };

  const shareURL = window.location.origin + "/users/" + user.screenName;

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
      </Box>
      <Paper elevation={3} sx={{ mt: 2 }}>
        <List component="nav" dense>
          <SongList data={data} collapsed={false} />
        </List>
      </Paper>
      <SongSubmitForm onAddSong={onAddSong} />
    </Container>
  );
};

const MyPage: React.FC = () => {
  const us = useContext(UserStateContext);
  if (us.state === "loading") return <LoadingPage />;
  if (us.state === "signed out") return <UnauthorizedPage />;

  return <MyPageContent user={us.user} />;
};

export default MyPage;
