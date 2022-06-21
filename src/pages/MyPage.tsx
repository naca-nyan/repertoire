import React, { useState } from "react";
import { Box, Button, List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { User } from "firebase/auth";
import NotFoundPage from "./NotFoundPage";
import LoadingPage from "./LoadingPage";
import { Song } from "../song";
import SongList from "../SongList";
import SongSubmitForm from "../SongSubmitForm";
import { onValue, ref, set } from "firebase/database";
import { database } from "../firebase";

const songPath = (userId: string) => `/users/${userId}/songs/`;

function getSongs(userId: string): Promise<Song[]> {
  return new Promise((resolve, reject) => {
    onValue(
      ref(database, songPath(userId)),
      (snapshot) => {
        const songs = snapshot.val() || [];
        resolve(songs);
      },
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}

async function setSongs(userId: string, songs: Song[]) {
  await set(ref(database, songPath(userId)), songs);
}

interface Props {
  user?: User | null;
}

const MyPage: React.FC<Props> = ({ user }) => {
  const [data, setData] = useState<undefined | Song[]>(undefined);

  if (user === undefined) {
    return <LoadingPage />;
  }
  if (user === null) {
    return <NotFoundPage />;
  }

  // @ts-ignore
  const userId: string | undefined = user.reloadUserInfo?.screenName;
  if (!userId) {
    return <NotFoundPage />;
  }

  if (data === undefined) {
    getSongs(userId).then((data) => setData(data));
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
