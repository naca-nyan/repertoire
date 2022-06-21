import React, { ChangeEventHandler, useState } from "react";
import { Add, Close } from "@mui/icons-material";
import { Button, Fab, Fade, IconButton, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Song } from "./song";

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
  onAddSong: (song: Song) => void;
}

const SongSubmitForm: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setURL] = useState("");

  const [helperText, setHelperText] = useState("");

  function clearAndClose() {
    setTitle("");
    setArtist("");
    setURL("");
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

  const handleOnChange: ChangeEventHandler<any> = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    if (id === "title") setTitle(value);
    if (id === "artist") setArtist(value);
    if (id === "url") setURL(value);
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
    const song = {
      artist,
      title,
      url,
    };
    props.onAddSong(song);
    clearAndClose();
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
              id="title"
              label="曲名"
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
            <TextField
              id="url"
              label="URL"
              autoComplete="off"
              error={Boolean(helperText)}
              onChange={handleOnChange}
              sx={textfieldStyle}
              helperText={helperText}
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
