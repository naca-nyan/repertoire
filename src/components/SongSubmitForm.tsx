import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Add, Close, Delete, Done } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Song, SongEntry } from "../data/song";
import { fromURL, toURL } from "./utils";

interface Props {
  open: boolean;
  formData?: SongEntry;
  artists: string[];
  onSubmit: (songId: string, song: Song) => void;
  onClose: () => void;
  onDelete?: (songId: string) => void;
}

const SongSubmitForm: React.FC<Props> = ({
  open,
  formData,
  artists,
  onSubmit,
  onClose,
  onDelete,
}) => {
  const [url, setURL] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    if (formData) {
      const [songId, song] = formData;
      if (songId) setURL(toURL(songId, song).href);
      if (song.title) setTitle(song.title);
      if (song.artist) setArtist(song.artist);
    }
  }, [formData]);

  function clearAndClose() {
    setURL("");
    setTitle("");
    setArtist("");
    setHelperText("");
    onClose();
  }

  function handleModalClose() {
    if (url || title || artist) return;
    clearAndClose();
  }

  function handleCancel() {
    clearAndClose();
  }

  const setTitleFromUrl = (url: string) => {
    try {
      const { songId } = fromURL(new URL(url));
      if (songId.startsWith("chordwiki:"))
        setTitle(songId.replace("chordwiki:", ""));
    } catch (e) {
      setHelperText(e instanceof Error ? e.message : String(e));
    }
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    if (id === "url") {
      setURL(value);
      setTitleFromUrl(value);
    }
    if (id === "title") setTitle(value);
    if (id === "artist") setArtist(value);
    if (validate() === true) setHelperText("");
  };

  function validate(): true | string {
    try {
      fromURL(new URL(url));
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
    if (!url || !title || !artist) {
      return "必須の項目をすべて入力してください";
    }
    return true;
  }

  const handleClickAdd = () => {
    const validateResult = validate();
    if (validateResult !== true) {
      setHelperText(validateResult);
      return;
    }
    try {
      const { songId, key, symbol } = fromURL(new URL(url));
      const song: Song = { artist, title };
      if (key) song.key = key;
      if (symbol) song.symbol = symbol;
      if (formData) {
        const [, oldSong] = formData;
        if (oldSong.comment) song.comment = oldSong.comment;
        if (oldSong.createdAt) song.createdAt = oldSong.createdAt;
      }
      onSubmit(songId, song);
      clearAndClose();
    } catch (e) {
      if (e instanceof Error) {
        setHelperText(e.message);
      }
    }
  };
  const handleClickDelete = () => {
    if (formData && onDelete) {
      const [songId] = formData;
      if (songId) onDelete(songId);
    }
  };

  return (
    <Dialog open={open} onClose={handleModalClose}>
      <DialogTitle>
        <IconButton onClick={handleCancel} sx={{ float: "right" }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          id="url"
          value={url}
          label="URL"
          fullWidth
          autoComplete="off"
          error={Boolean(helperText)}
          onChange={handleOnChange}
          helperText={helperText}
          sx={{ mt: 1, mb: 4 }}
        />
        <TextField
          id="title"
          value={title}
          label="曲名"
          fullWidth
          autoComplete="off"
          error={Boolean(helperText)}
          onChange={handleOnChange}
          sx={{ mb: 4 }}
        />
        <Autocomplete
          id="artist"
          value={artist}
          freeSolo
          options={artists}
          onChange={(_, value) => setArtist(value ?? "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="アーティスト名"
              onChange={(e) => setArtist(e.target.value)}
              error={Boolean(helperText)}
            />
          )}
        />
      </DialogContent>
      {formData ? (
        <DialogActions
          sx={{ justifyContent: "space-between", px: 3, pt: 1, pb: 3 }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleClickDelete}
          >
            削除
          </Button>
          <Button
            variant="contained"
            startIcon={<Done />}
            onClick={handleClickAdd}
          >
            更新
          </Button>
        </DialogActions>
      ) : (
        <DialogActions sx={{ px: 3, pt: 1, pb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleClickAdd}
          >
            知ってる曲に追加
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default SongSubmitForm;
