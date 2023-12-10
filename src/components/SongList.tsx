import React, { useContext, useEffect, useState } from "react";
import {
  Card,
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
import {
  onSongExists,
  removeSong,
  setSong,
  Song,
  SongEntries,
} from "../data/song";
import { UserStateContext } from "../contexts/user";
import { siteNameOf, toURL } from "./utils";
import { Theme } from "@mui/material";

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

const SongItem: React.FC<{ songEntry: SongEntries[number] }> = ({
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
  songEntries: SongEntries;
  open?: boolean;
}> = (props) => {
  const { artist, songEntries } = props;
  useEffect(() => setOpen(props.open ?? true), [props.open]);
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <Card sx={{ marginBottom: 2 }}>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText
          primary={artist}
          primaryTypographyProps={{ fontWeight: "bold" }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {songEntries.map(([songId, song]) => (
          <SongItem songEntry={[songId, song]} key={songId} />
        ))}
      </Collapse>
    </Card>
  );
};

function uniqByArtist(songEntries: SongEntries): Record<string, SongEntries> {
  const artists: Record<string, SongEntries> = {};
  for (const [songId, song] of songEntries) {
    const songsOfTheArtist = artists[song.artist] ?? [];
    artists[song.artist] = [...songsOfTheArtist, [songId, song]];
  }
  return artists;
}

const SongList: React.FC<{
  data: SongEntries;
  collapsed: boolean;
  subheader?: React.ReactNode;
}> = ({ data, collapsed, subheader }) => {
  const uniq = uniqByArtist(data);
  const styles = (theme: Theme) => ({
    [theme.breakpoints.up("sm")]: { columnCount: 2 },
    [theme.breakpoints.up("md")]: { columnCount: 3 },
    [theme.breakpoints.up("lg")]: { columnCount: 4 },
    [theme.breakpoints.up("xl")]: { columnCount: 5 },
  });
  return (
    <List dense subheader={subheader} sx={styles}>
      {Object.entries(uniq).map(([artist, songs]) => (
        <SongListOfArtist
          key={artist}
          artist={artist}
          songEntries={songs}
          open={!collapsed}
        />
      ))}
    </List>
  );
};

export default React.memo(SongList);
