import React, { useContext, useEffect, useState } from "react";
import { Button, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { Container } from "@mui/system";
import IosShareIcon from "@mui/icons-material/IosShare";
import LoadingPage from "./LoadingPage";
import { getSongs, pushSong, Song, SongEntries } from "../data/song";
import SongList from "../components/SongList";
import SongSubmitForm from "../components/SongSubmitForm";
import { UserStateContext } from "../contexts/user";
import UnauthorizedPage from "./UnauthorizedPage";
import { User } from "../data/user";

const ShareButton: React.FC<{ url: string }> = ({ url }) => {
  const [notifyOpen, setNotifyOpen] = useState(false);
  function copyShareURL() {
    navigator.clipboard.writeText(url);
    setNotifyOpen(true);
  }
  return (
    <Tooltip title="共有リンクをコピー">
      <Button
        onClick={copyShareURL}
        color="inherit"
        sx={{
          backgroundColor: "#f2f2f2",
          "&:hover": { backgroundColor: "#e5e5e5" },
          borderRadius: "20px",
        }}
      >
        <IosShareIcon />
        <Typography sx={{ ml: "4px" }}>共有</Typography>
        <Snackbar
          open={notifyOpen}
          autoHideDuration={3000}
          onClose={() => setNotifyOpen(false)}
          message="共有リンクをコピーしました"
        />
      </Button>
    </Tooltip>
  );
};

const MyPageContent: React.FC<{
  user: User;
}> = ({ user }) => {
  const userId = user.userId;
  const [data, setData] = useState<undefined | SongEntries>(undefined);

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

  const onAddSong = (songId: string, song: Song) => {
    pushSong(userId, songId, { ...song, createdAt: Date.now() })
      .then((songId) => setData([...data, [songId, song]]))
      .catch((e) => console.error("cannot push song", song, e));
  };

  const shareURL = window.location.origin + "/users/" + user.screenName;
  const artists = data.map(([_, song]) => song.artist);
  const artistsUniq = [...new Set(artists)];
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack direction="row" spacing={1}>
        <Typography variant="h5">
          {user.displayName}の知ってる曲リスト
        </Typography>
        <ShareButton url={shareURL} />
      </Stack>
      <SongList data={data} collapsed={false} />
      <SongSubmitForm artists={artistsUniq} onAddSong={onAddSong} />
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
