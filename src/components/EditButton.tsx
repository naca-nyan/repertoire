import React, { MouseEventHandler, useContext, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Song, SongEntry, removeSong, setSong } from "../data/song";
import { UserStateContext } from "../contexts/user";
import SongSubmitForm from "./SongSubmitForm";

const Edit: React.FC<{
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ title, onClick }) => (
  <Tooltip title={title} disableInteractive>
    <IconButton edge="end" onClick={onClick}>
      <EditIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);

const EditButton: React.FC<{ songEntry: SongEntry }> = ({
  songEntry: [songId, song],
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const us = useContext(UserStateContext);
  const userId = us.state === "signedIn" ? us.user.userId : null;
  if (userId === null) return <Edit title="編集するときはログインしてね" />;

  const onClick = () => {
    setFormOpen(true);
  };
  const onUpdate = async (songIdNew: string, songNew: Song) => {
    if (songId !== songIdNew) await removeSong(userId, songId);
    await setSong(userId, songId, songNew);
  };
  const onDelete = async (songId: string) => {
    await removeSong(userId, songId);
  };

  return (
    <>
      <Edit title={"編集"} onClick={onClick} />
      <SongSubmitForm
        open={formOpen}
        formData={[songId, song]}
        artists={[song.artist]}
        onSubmit={onUpdate}
        onClose={() => setFormOpen(false)}
        onDelete={onDelete}
      />
    </>
  );
};

export default EditButton;
