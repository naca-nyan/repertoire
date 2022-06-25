import React, { useContext, useEffect, useState } from "react";
import {
  Collapse,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Bookmark,
  BookmarkAdded,
  BookmarkBorder,
  ExpandLess,
  ExpandMore,
  OpenInNew,
} from "@mui/icons-material";
import { setSong, Song, Songs } from "../data/song";
import { UserStateContext } from "../contexts/user";
import { BookmarksContext } from "../contexts/bookmarks";

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
  sx?: SxProps;
}> = ({ songId, song, sx }) => {
  const us = useContext(UserStateContext);
  const bookmarks = useContext(BookmarksContext);
  const bookmarked = bookmarks.includes(songId);
  const [clicked, setClicked] = useState(bookmarked);
  useEffect(() => setClicked(bookmarked), [bookmarked]);
  const userId = us.state === "signed in" ? us.user.userId : null;
  if (userId === null) {
    return (
      <Tooltip title={"知ってる曲を登録するにはログイン！"}>
        <BookmarkBorder />
      </Tooltip>
    );
  }
  if (bookmarked) {
    return (
      <Tooltip title={"知ってる曲に登録済み"}>
        <Bookmark />
      </Tooltip>
    );
  }
  const onClick = () => {
    setSong(userId, songId, song);
    setClicked(true);
  };
  return (
    <Tooltip title={clicked ? "知ってる曲に保存しました！" : "知ってる曲！"}>
      <IconButton onClick={onClick} edge="end" disabled={clicked} sx={sx}>
        {clicked ? (
          <BookmarkAdded sx={{ color: "#d1001f" }} />
        ) : (
          <BookmarkBorder />
        )}
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
