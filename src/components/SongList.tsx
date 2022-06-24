import React, { useEffect, useState } from "react";
import {
  Collapse,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore, OpenInNew } from "@mui/icons-material";
import { Songs } from "../data/song";

function labelURL(url: string): string {
  let label = "";
  if (url.startsWith("https://ja.chordwiki.org/")) label = "ChordWiki";
  if (url.startsWith("https://www.ufret.jp/")) label = "U-FRET";
  const urlDecoded = decodeURIComponent(url);
  return label ? `${label} (${urlDecoded})` : urlDecoded;
}

const SongListItem: React.FC<{
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
        <List component="div" disablePadding dense>
          {Object.values(songs).map(({ url, title, comment }) => (
            <ListItemButton
              component="a"
              href={url}
              target="_blank"
              rel="noopener"
              key={title}
              sx={{ pl: 4 }}
            >
              <Tooltip arrow title={labelURL(url)} placement="bottom-start">
                <ListItemText>
                  <Link component="span">{title}</Link>
                  <OpenInNew color="disabled" sx={{ height: "12px", p: 0 }} />
                  <Typography
                    sx={{ float: "right", color: "#999", fontSize: "1em" }}
                  >
                    {comment}
                  </Typography>
                </ListItemText>
              </Tooltip>
            </ListItemButton>
          ))}
        </List>
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
        <SongListItem
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
