import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Fab,
  Grid,
  Link,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddIcon from "@mui/icons-material/Add";
import Check from "@mui/icons-material/Check";

import LoadingPage from "./LoadingPage";
import {
  watchSongs,
  Song,
  SongEntry,
  setSong,
  setOrderArtists,
  watchOrderArtists,
} from "../data/song";
import SongList from "../components/SongList";
import SongSubmitForm from "../components/SongSubmitForm";
import { UserStateContext } from "../contexts/user";
import UnauthorizedPage from "./UnauthorizedPage";
import { UserInfo } from "../data/user";
import EditButton from "../components/EditButton";
import FromClipboard from "../components/FromClipboard";
import Header from "../components/Header";
import SortableArtistList from "../components/SortableArtistList";
import { MoveUp, UnfoldLess, UnfoldMore } from "@mui/icons-material";

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
          whiteSpace: "nowrap",
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
  const [songEntries, setSongEntries] = useState<undefined | SongEntry[]>(
    undefined
  );
  const [formOpen, setFormOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sortArtist, setSortArtist] = useState(false);
  const [artists_, setArtists_] = useState<string[] | undefined>(undefined);
  const artists = artists_ ?? [];

  useEffect(() => {
    return watchSongs(userId, (songs) => setSongEntries(songs));
  }, [userId]);

  useEffect(() => {
    return watchOrderArtists(userId, (order) => setArtists_(order));
  }, [userId]);

  if (songEntries === undefined) {
    return <LoadingPage />;
  }

  const onSubmitSong = (songId: string, song: Song) => {
    setSong(userId, songId, { ...song, createdAt: Date.now() });
  };

  const setDefaultOrderArtists = () => {
    if (!artists_ || !songEntries) return;
    const res: Map<string, boolean> = new Map();
    for (const artist of artists) {
      res.set(artist, false);
    }
    for (const [, song] of songEntries) {
      res.set(song.artist, true);
    }
    for (const artist of artists) {
      if (!res.get(artist)) res.delete(artist);
    }
    setArtists_([...res.keys()]);
  };

  const shareURL = window.location.origin + "/users/" + user.screenName;
  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Grid container rowSpacing={1}>
        <Grid item xs={12} sm={10}>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5">
              {user.displayName}の知ってる曲リスト
            </Typography>
            <ShareButton url={shareURL} />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={2}>
          <ButtonGroup style={{ display: "flex", justifyContent: "flex-end" }}>
            <FromClipboard userId={userId} />
            <Tooltip title={collapsed ? "曲を表示" : "曲を隠す"}>
              <Button
                disabled={sortArtist}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed || sortArtist ? <UnfoldMore /> : <UnfoldLess />}
              </Button>
            </Tooltip>
            <Tooltip title="アーティスト名を並び換え">
              <Button
                variant={sortArtist ? "contained" : "outlined"}
                disabled={!artists_ || !collapsed}
                onClick={() => {
                  if (!artists_) return;
                  if (sortArtist) setOrderArtists(userId, artists_);
                  else setDefaultOrderArtists();
                  setSortArtist(!sortArtist);
                }}
              >
                {sortArtist ? <Check /> : <MoveUp />}
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Grid>
      </Grid>
      {songEntries.length === 0 && (
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
      {sortArtist ? (
        <SortableArtistList artists={artists} onSortEnd={setArtists_} />
      ) : (
        <SongList
          songEntries={songEntries}
          sortBy={artists}
          collapsed={collapsed}
          songAction={EditButton}
        />
      )}
      <SongSubmitForm
        open={formOpen}
        artists={artists}
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
