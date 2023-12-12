import React, { useEffect, useState } from "react";
import {
  Card,
  Collapse,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { SongEntry } from "../data/song";
import { siteKind, siteNames, toURL } from "./utils";
import { Theme } from "@mui/material";
import SiteIcon from "./SiteIcon";
import StarButton from "./StarButton";

const SongItem: React.FC<{ songEntry: SongEntry }> = ({
  songEntry: [songId, song],
}) => (
  <ListItem
    disablePadding
    secondaryAction={<StarButton songEntry={[songId, song]} />}
  >
    <Tooltip arrow title={siteNames[siteKind(songId)]} placement="left">
      <ListItemButton
        component="a"
        href={toURL(songId, song).href}
        target="_blank"
        rel="noopener"
      >
        <ListItemText>
          <SiteIcon kind={siteKind(songId)} />
          <Link component="span">{song.title}</Link>
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
  songEntries: SongEntry[];
  open?: boolean;
}> = (props) => {
  const { artist, songEntries } = props;
  useEffect(() => setOpen(props.open ?? true), [props.open]);
  const [open, setOpen] = useState(props.open ?? true);
  return (
    <Card sx={{ marginBottom: 2 }}>
      <ListItemButton
        onClick={() => setOpen(!open)}
        sx={{ paddingRight: "10px" }}
      >
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

function uniqByArtist(songEntries: SongEntry[]): Record<string, SongEntry[]> {
  const artists: Record<string, SongEntry[]> = {};
  for (const [songId, song] of songEntries) {
    const songsOfTheArtist = artists[song.artist] ?? [];
    artists[song.artist] = [...songsOfTheArtist, [songId, song]];
  }
  return artists;
}

const SongList: React.FC<{
  data: SongEntry[];
  collapsed: boolean;
}> = ({ data, collapsed }) => {
  const uniq = uniqByArtist(data);
  const styles = (theme: Theme) => ({
    [theme.breakpoints.up("sm")]: { columnCount: 2 },
    [theme.breakpoints.up("md")]: { columnCount: 3 },
    [theme.breakpoints.up("lg")]: { columnCount: 4 },
    [theme.breakpoints.up("xl")]: { columnCount: 5 },
  });
  return (
    <List dense sx={styles}>
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
