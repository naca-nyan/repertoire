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
import { removeSong, setSong, Song, Songs } from "../data/song";
import { UserStateContext } from "../contexts/user";
import { onValue, ref } from "firebase/database";
import { database } from "../firebase";

function labelURL(url: string): string {
  let label = "";
  if (url.startsWith("https://ja.chordwiki.org/")) label = "ChordWiki";
  if (url.startsWith("https://www.ufret.jp/")) label = "U-FRET";
  const urlDecoded = decodeURIComponent(url);
  return label ? `${label} (${urlDecoded})` : urlDecoded;
}

const BookmarkButton: React.FC<{
  songId: string;
  song: Song;
}> = ({ songId, song }) => {
  const us = useContext(UserStateContext);
  const userId = us.state === "signed in" ? us.user.userId : null;
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(
    () =>
      onValue(ref(database, `/users/${userId}/songs/${songId}`), (snapshot) => {
        setBookmarked(snapshot.exists());
      }),
    [userId, songId]
  );

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
    setSong(userId, songId, song);
  };
  return (
    <Tooltip title="知ってる曲！">
      <IconButton onClick={onClick} edge="end">
        <BookmarkBorder />
      </IconButton>
    </Tooltip>
  );
};

const ListSongs: React.FC<{ songs: Songs }> = ({ songs }) => (
  <List component="div" disablePadding dense>
    {Object.entries(songs).map(([songId, { title, artist, url, comment }]) => (
      <ListItem
        disablePadding
        key={songId}
        secondaryAction={
          <BookmarkButton songId={songId} song={{ title, artist, url }} />
        }
      >
        <Tooltip arrow title={labelURL(url)} placement="bottom-start">
          <ListItemButton
            component="a"
            href={url}
            target="_blank"
            rel="noopener"
          >
            <ListItemText>
              <Link component="span">{title}</Link>
              <OpenInNew color="disabled" sx={{ height: "12px", p: 0 }} />
              <Typography
                sx={{ float: "right", color: "#999", fontSize: "1em" }}
              >
                {comment}
              </Typography>
            </ListItemText>
          </ListItemButton>
        </Tooltip>
      </ListItem>
    ))}
  </List>
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
    <>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText
          primary={artist}
          primaryTypographyProps={{ fontWeight: "bold" }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ListSongs songs={songs} />
      </Collapse>
    </>
  );
};

function uniqByArtist(songs: Songs): { [artist: string]: Songs } {
  const artists: { [artist: string]: Songs } = {};
  for (const [songId, song] of Object.entries(songs)) {
    const songsOfTheArtist = artists[song.artist];
    artists[song.artist] = { ...songsOfTheArtist, [songId]: song };
  }
  return artists;
}

const SongList: React.FC<{
  data: Songs;
  collapsed: boolean;
}> = React.memo(({ data, collapsed }) => {
  const uniq = uniqByArtist(data);
  return (
    <>
      {Object.entries(uniq).map(([artist, songs]) => (
        <SongListOfArtist
          key={artist}
          artist={artist}
          songs={songs}
          open={!collapsed}
        />
      ))}
    </>
  );
});

export default SongList;
