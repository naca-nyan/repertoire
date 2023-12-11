import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { onSongExists, removeSong, setSong, SongEntries } from "../data/song";
import { UserStateContext } from "../contexts/user";

const Star: React.FC<{
  title: string;
  colored?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ colored, title, onClick }) => (
  <Tooltip title={title}>
    <IconButton edge="end" onClick={onClick}>
      <StarIcon
        fontSize="small"
        sx={{ color: colored ? "#f59e0b" : undefined }}
      />
    </IconButton>
  </Tooltip>
);

const StarButton: React.FC<{ songEntry: SongEntries[number] }> = ({
  songEntry: [songId, song],
}) => {
  const us = useContext(UserStateContext);
  const userId = us.state === "signed in" ? us.user.userId : null;
  const [favd, setFavd] = useState(false);
  useEffect(() => {
    if (!userId) return;
    onSongExists(userId, songId, setFavd);
  }, [userId, songId]);

  if (userId === null)
    return <Star title="知ってる曲を登録するにはログイン！" />;

  const onClick = () => {
    if (favd) {
      removeSong(userId, songId);
    } else {
      setSong(userId, songId, {
        artist: song.artist,
        title: song.title,
        createdAt: Date.now(),
      });
    }
  };
  return (
    <Star
      colored={favd}
      title={favd ? "知ってる曲から削除する" : "知ってる曲に登録する！"}
      onClick={onClick}
    />
  );
};

export default StarButton;
