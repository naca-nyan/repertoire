import React, { useContext, useEffect, useState } from "react";
import {
  Collapse,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  ExpandLess,
  ExpandMore,
  OpenInNew,
} from "@mui/icons-material";
import { onSongExists, removeSong, setSong, Song, Songs } from "../data/song";
import { UserStateContext } from "../contexts/user";
import { siteNameOf, toURL } from "./utils";

const BookmarkButton: React.FC<{
  songId: string;
  song: Song;
}> = ({ songId, song }) => {
  const us = useContext(UserStateContext);
  const userId = us.state === "signed in" ? us.user.userId : null;
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
    if (!userId) return;
    onSongExists(userId, songId, setBookmarked);
  }, [userId, songId]);

  if (userId === null) {
    return (
      <Tooltip title="知ってる曲を登録するにはログイン！">
        <BookmarkBorder />
      </Tooltip>
    );
  }
  const onClickAdded = () => {
    removeSong(userId, songId);
  };
  if (bookmarked) {
    return (
      <Tooltip title="知ってる曲に登録済み">
        <IconButton onClick={onClickAdded} edge="end">
          <Bookmark />
        </IconButton>
      </Tooltip>
    );
  }
  const onClick = () => {
    setSong(userId, songId, { ...song, createdAt: Date.now() });
  };
  return (
    <Tooltip title="知ってる曲！">
      <IconButton onClick={onClick} edge="end">
        <BookmarkBorder />
      </IconButton>
    </Tooltip>
  );
};

const SongItem: React.FC<{ songEntry: Songs[number] }> = ({
  songEntry: [songId, song],
}) => (
  <ListItem
    disablePadding
    secondaryAction={
      <BookmarkButton
        songId={songId}
        song={{ title: song.title, artist: song.artist }}
      />
    }
  >
    <Tooltip arrow title={siteNameOf(songId)} placement="bottom-start">
      <ListItemButton
        component="a"
        href={toURL(songId, song).href}
        target="_blank"
        rel="noopener"
      >
        <ListItemText>
          <Link component="span">{song.title}</Link>
          <OpenInNew color="disabled" sx={{ height: "12px", p: 0 }} />
          <Typography sx={{ float: "right", color: "#999", fontSize: "1em" }}>
            {song.comment}
          </Typography>
        </ListItemText>
      </ListItemButton>
    </Tooltip>
  </ListItem>
);

const SongListOfArtist: React.FC<{
  artist: string;
  songs: Songs;
  open?: boolean;
}> = (props) => {
  const { artist, songs } = props;
  useEffect(() => setOpen(props.open ?? true), [props.open]);
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <List disablePadding dense>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText
          primary={artist}
          primaryTypographyProps={{ fontWeight: "bold" }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {songs.map(([songId, song]) => (
          <SongItem songEntry={[songId, song]} key={songId} />
        ))}
      </Collapse>
    </List>
  );
};

function uniqByArtist(songs: Songs): { [artist: string]: Songs } {
  const artists: { [artist: string]: Songs } = {};
  for (const [songId, song] of songs) {
    const songsOfTheArtist = artists[song.artist] ?? [];
    artists[song.artist] = [...songsOfTheArtist, [songId, song]];
  }
  return artists;
}

const SongList: React.FC<{
  data: Songs;
  collapsed: boolean;
  subheader?: React.ReactNode;
}> = ({ data, collapsed, subheader }) => {
  const uniq = uniqByArtist(data);
  return (
    <List dense subheader={subheader}>
      {Object.entries(uniq).map(([artist, songs]) => (
        <SongListOfArtist
          key={artist}
          artist={artist}
          songs={songs}
          open={!collapsed}
        />
      ))}
    </List>
  );
};

export default React.memo(SongList);
