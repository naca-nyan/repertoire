import React, { useContext, useState } from "react";
import { Box, Button, List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import { getSongs, setSongs, Song } from "../data/song";
import SongList from "../components/SongList";
import SongSubmitForm from "../components/SongSubmitForm";
import { UserStateContext } from "../contexts/user";
import UnauthorizedPage from "./UnauthorizedPage";
import ErrorPage from "./ErrorPage";

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

  // FIXME: safe method to get screen name
  // @ts-ignore
  const userId: string | undefined = user.reloadUserInfo?.screenName;
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

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">
          {user.displayName}の知ってる曲リスト
        </Typography>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </Box>
      <List component="nav" dense>
        <SongList data={data} filter="" collapsed={false} />
      </List>
      <SongSubmitForm onAddSong={(song) => setData([...data, song])} />
    </Container>
  );
};

export default MyPage;
