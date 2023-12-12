import React, { ChangeEventHandler, useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Fade,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Song } from "../data/song";
import { fromURL } from "./utils";

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

interface Props {
  open: boolean;
  artists: string[];
  onSubmit: (songId: string, song: Song) => void;
  onClose: () => void;
}

const SongSubmitForm: React.FC<Props> = ({
  open,
  artists,
  onSubmit,
  onClose,
}) => {
  const [url, setURL] = useState("");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const [helperText, setHelperText] = useState("");

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

  const handleOnChange: ChangeEventHandler<any> = (e) => {
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
      onSubmit(songId, song);
      clearAndClose();
    } catch (e) {
      if (e instanceof Error) {
        setHelperText(e.message);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
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
          <Autocomplete
            id="artist"
            freeSolo
            options={artists}
            onChange={(_, value) => setArtist(value ?? "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="アーティスト名"
                error={Boolean(helperText)}
                sx={textfieldStyle}
              />
            )}
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
  );
};

export default SongSubmitForm;
