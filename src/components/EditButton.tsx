import React, { MouseEventHandler, useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { SongEntry } from "../data/song";
import { UserStateContext } from "../contexts/user";

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
  const us = useContext(UserStateContext);
  const userId = us.state === "signed in" ? us.user.userId : null;
  if (userId === null) return <Edit title="編集するときはログインしてね" />;

  const onClick = () => {
    console.log(userId, songId, song);
  };
  return <Edit title={"編集"} onClick={onClick} />;
};

export default EditButton;
