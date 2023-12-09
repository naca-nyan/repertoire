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

function labelURL(songId: string): string {
  if (songId.startsWith("chordwiki:")) return "ChordWiki";
  if (songId.startsWith("gakkime:")) return "楽器.me";
  if (songId.startsWith("ufret:")) return "U-FRET";
  if (songId.startsWith("youtube:")) return "YouTube";
  return "";
}

function constructURL(songId: string, song: Song): string {
  if (songId.startsWith("chordwiki:")) {
    const id = songId.replace("chordwiki:", "");
    const url = new URL("https://ja.chordwiki.org");
    if (song.key || song.symbol) {
      url.pathname = "/wiki.cgi";
      url.searchParams.set("c", "view");
      url.searchParams.set("t", id);
      url.searchParams.set("key", song.key?.toString() ?? "");
      url.searchParams.set("symbol", song.symbol ?? "");
      return url.href;
    }
    url.pathname = "/wiki/" + encodeURIComponent(id).replaceAll("%20", "+");
    return url.href;
  }
  if (songId.startsWith("gakkime:")) {
    const id = songId.replace("gakkime:", "");
    const url = new URL("https://gakufu.gakki.me/m/index.php");
    url.searchParams.set("p", id);
    if (song.key) url.searchParams.set("k", song.key.toString());
    return url.href;
  }
  if (songId.startsWith("ufret:")) {
    const id = songId.replace("ufret:", "");
    const url = new URL("https://www.ufret.jp/song.php");
    url.searchParams.set("data", id);
    return url.href;
  }
  if (songId.startsWith("youtube:")) {
    const id = songId.replace("youtube:", "");
    const url = new URL("https://www.youtube.com/watch");
    url.searchParams.set("v", id);
    return url.href;
  }
  return "";
}

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

const ListSongs: React.FC<{ songs: Songs }> = ({ songs }) => (
  <List component="div" disablePadding dense>
    {songs.map(([songId, song]) => (
      <ListItem
        disablePadding
        key={songId}
        secondaryAction={
          <BookmarkButton
            songId={songId}
            song={{ title: song.title, artist: song.artist }}
          />
        }
      >
        <Tooltip arrow title={labelURL(songId)} placement="bottom-start">
          <ListItemButton
            component="a"
            href={constructURL(songId, song)}
            target="_blank"
            rel="noopener"
          >
            <ListItemText>
              <Link component="span">{song.title}</Link>
              <OpenInNew color="disabled" sx={{ height: "12px", p: 0 }} />
              <Typography
                sx={{ float: "right", color: "#999", fontSize: "1em" }}
              >
                {song.comment}
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
  for (const [songId, song] of songs) {
    const songsOfTheArtist = artists[song.artist] ?? [];
    artists[song.artist] = [...songsOfTheArtist, [songId, song]];
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
