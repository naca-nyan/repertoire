import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Fab,
  Link,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddIcon from "@mui/icons-material/Add";

import LoadingPage from "./LoadingPage";
import { watchSongs, Song, SongEntry, setSong } from "../data/song";
import SongList from "../components/SongList";
import SongSubmitForm from "../components/SongSubmitForm";
import { UserStateContext } from "../contexts/user";
import UnauthorizedPage from "./UnauthorizedPage";
import { UserInfo } from "../data/user";
import EditButton from "../components/EditButton";
import FromClipboardForm from "../components/FromClipboardForm";
import Header from "../components/Header";

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
        startIcon={<IosShareIcon />}
        color="inherit"
        sx={{
          px: "11px",
          backgroundColor: "#f2f2f2",
          "&:hover": { backgroundColor: "#e5e5e5" },
          borderRadius: "20px",
        }}
      >
        <Typography>共有</Typography>
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

const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, onClick }) => (
  <Fab
    onClick={onClick}
    color="primary"
    sx={{ position: "fixed", bottom: 32, right: 32 }}
  >
    {icon}
  </Fab>
);

const MyPageContent: React.FC<{
  user: UserInfo;
}> = ({ user }) => {
  const userId = user.userId;
  const [data, setData] = useState<undefined | SongEntry[]>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [FromClipboardFormOpen, setFromClipboardFormOpen] = useState(false);

  useEffect(() => {
    return watchSongs(userId, (songs) => setData(songs));
  }, [userId]);

  if (data === undefined) {
    return <LoadingPage />;
  }

  const onSubmitSong = (songId: string, song: Song) => {
    setSong(userId, songId, { ...song, createdAt: Date.now() });
  };

  const shareURL = window.location.origin + "/users/" + user.screenName;
  const artists = data.map(([, song]) => song.artist);
  const artistsUniq = [...new Set(artists)];
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Stack direction="row" spacing={1}>
        <Typography variant="h5">
          {user.displayName}の知ってる曲リスト
        </Typography>
        <ShareButton url={shareURL} />
        <div style={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          onClick={() => setFromClipboardFormOpen(true)}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          クリップボードから追加
        </Button>
        <FromClipboardForm
          userId={userId}
          open={FromClipboardFormOpen}
          onClose={() => setFromClipboardFormOpen(false)}
        />
      </Stack>
      {data.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <Typography sx={{ mt: 6 }}>
            曲が登録されていません。右下の「＋」ボタンから曲を登録しましょう！
          </Typography>
          <Typography sx={{ mt: 1 }}>
            詳しい使い方は
            <Link
              href="https://github.com/naca-nyan/repertoire/wiki"
              target="_blank"
            >
              こちら
            </Link>
          </Typography>
        </div>
      )}
      <SongList data={data} collapsed={false} songAction={EditButton} />
      <SongSubmitForm
        open={formOpen}
        artists={artistsUniq}
        onSubmit={onSubmitSong}
        onClose={() => setFormOpen(false)}
      />
      <FloatingActionButton
        icon={<AddIcon />}
        onClick={() => setFormOpen(true)}
      />
    </Container>
  );
};

const MyPage: React.FC = () => {
  const us = useContext(UserStateContext);
  if (us.state === "loading") return <LoadingPage />;
  if (us.state === "signedOut") return <UnauthorizedPage />;

  return (
    <>
      <Header title="マイページ" />
      <MyPageContent user={us.user} />
    </>
  );
};

export default MyPage;
