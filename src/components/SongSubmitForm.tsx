import React, { ChangeEventHandler, useState } from "react";
import { Add, Close } from "@mui/icons-material";
import { Button, Fab, Fade, IconButton, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Song } from "../data/song";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "sm",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  px: 4,
  py: 2,
};

const textfieldStyle = {
  width: "100%",
  mb: 4,
};

function parseSongFrom(url: URL): {
  songId: string;
  key?: number;
  symbol?: string;
} {
  if (url.host === "ja.chordwiki.org") {
    // https://ja.chordwiki.org/wiki/%E3%81%8B%E3%82%89%E3%81%8F%E3%82%8A%E3%83%94%E3%82%A8%E3%83%AD
    if (url.pathname.startsWith("/wiki/")) {
      const idEncoded = url.pathname.split("/").pop() ?? "";
      const id = decodeURIComponent(idEncoded).replaceAll("+", " ");
      if (!id) throw new Error("Empty songId parsing ja.chordwiki.org");
      return { songId: `chordwiki:${id}` };
    }
    // https://ja.chordwiki.org/wiki.cgi?c=view&t=%E3%83%8B%E3%83%A3%E3%83%BC%E3%82%B9%E3%81%AE%E3%81%86%E3%81%9F&key=2&symbol=
    if (url.pathname.startsWith("/wiki.cgi")) {
      const id = decodeURIComponent(url.searchParams.get("t") ?? "");
      const key = parseInt(url.searchParams.get("key") ?? "0");
      const symbol = url.searchParams.get("symbol");
      if (!id)
        throw new Error(
          "Empty songId parsing ja.chordwiki.org with key or symbol"
        );
      return {
        songId: `chordwiki:${id}`,
        key: key || undefined,
        symbol: symbol || undefined,
      };
    }
  }
  if (url.host === "gakufu.gakki.me") {
    // https://gakufu.gakki.me/m/data/N13285.html
    if (url.pathname.endsWith(".html")) {
      const filename = url.pathname.split("/").pop() ?? "";
      const id = filename.replace(".html", "");
      if (!id) throw new Error("Empty songId parsing gakufu.gakki.me");
      return { songId: `gakkime:${id}` };
    }
    // https://gakufu.gakki.me/p/index.php?p=N12380&k=#rpA
    if (url.pathname.endsWith(".php")) {
      const id = url.searchParams.get("p");
      const keyText = url.searchParams.get("k") ?? "";
      const key = parseInt(keyText.replace("m", "-").replace("p", "+"));
      if (!id) throw new Error("Empty songId parsing gakufu.gakki.me with key");
      return { songId: `gakkime:${id}`, key: key || undefined };
    }
  }
  // https://www.ufret.jp/song.php?data=92548
  if (url.host === "www.ufret.jp") {
    const id = url.searchParams.get("data");
    if (!id) throw new Error("Empty songId parsing www.ufret.jp");
    return { songId: `ufret:${id}` };
  }
  // https://www.youtube.com/watch?v=TkroHwQYpFE
  if (url.host === "www.youtube.com") {
    const id = url.searchParams.get("v");
    if (!id) throw new Error("Empty songId parsing www.youtube.com");
    return { songId: `youtube:${id}` };
  }
  throw new Error("Unknown url " + url.href);
}

interface Props {
  onAddSong: (songId: string, song: Song) => void;
}

const SongSubmitForm: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const [url, setURL] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const [helperText, setHelperText] = useState("");

  function clearAndClose() {
    setURL("");
    setTitle("");
    setArtist("");
    setHelperText("");
    setOpen(false);
  }

  function handleClose() {
    if (title || artist || url) return;
    clearAndClose();
  }

  function handleCancel() {
    clearAndClose();
  }

  const setTitleFromUrl = (url: string) => {
    try {
      const { songId } = parseSongFrom(new URL(url));
      if (songId.startsWith("chordwiki:"))
        setTitle(songId.replace("chordwiki:", ""));
    } catch (e) {
      if (e instanceof Error) {
        setHelperText(e.message);
      }
    }
  };

  const handleOnChange: ChangeEventHandler<any> = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    if (id === "url") {
      setURL(value);
      setTitleFromUrl(value);
      return;
    }
    if (id === "title") setTitle(value);
    if (id === "artist") setArtist(value);
    if (helperText) validate();
  };

  function validate(): boolean {
    if (!title || !artist || !url) {
      setHelperText("必須の項目をすべて入力してください");
      return false;
    }
    setHelperText("");
    return true;
  }

  const handleClickAdd = () => {
    if (!validate()) return;
    try {
      const { songId, key, symbol } = parseSongFrom(new URL(url));
      const song: Song = { artist, title };
      if (key) song.key = key;
      if (symbol) song.symbol = symbol;
      props.onAddSong(songId, song);
      clearAndClose();
    } catch (e) {
      if (e instanceof Error) {
        setHelperText(e.message);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          // button height + bottom height
          height: 56 + 24,
        }}
      />
      <Box
        sx={{
          maxWidth: "sm",
          width: "100%",
          position: "fixed",
          bottom: 24,
          textAlign: "end",
          right: { xs: 24, sm: "auto" },
        }}
      >
        <Fab
          onClick={() => setOpen(true)}
          color="primary"
          sx={{ right: { xs: 0, sm: 24 } }}
        >
          <Add />
        </Fab>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Fade in={open}>
          <Box sx={boxStyle}>
            <IconButton onClick={handleCancel} sx={{ float: "right", mb: 2 }}>
              <Close />
            </IconButton>
            <TextField
              id="url"
              label="URL"
              autoComplete="off"
              error={Boolean(helperText)}
              onChange={handleOnChange}
              sx={textfieldStyle}
              helperText={helperText}
            />
            <TextField
              id="title"
              label="曲名"
              value={title}
              autoComplete="off"
              error={Boolean(helperText)}
              onChange={handleOnChange}
              sx={textfieldStyle}
            />
            <TextField
              id="artist"
              label="アーティスト名"
              error={Boolean(helperText)}
              onChange={handleOnChange}
              sx={textfieldStyle}
            />
            <Button
              variant="contained"
              onClick={handleClickAdd}
              sx={{ float: "right", mb: 2 }}
            >
              Add
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SongSubmitForm;
