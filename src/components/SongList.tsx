import React, { useEffect, useState } from "react";
import {
  Card,
  Collapse,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { SongEntry } from "../data/song";
import { siteKind, siteNames, toURL } from "./utils";
import { Theme } from "@mui/material";
import SiteIcon from "./SiteIcon";

const SongItem: React.FC<{
  songEntry: SongEntry;
  SongAction: React.FC<{ songEntry: SongEntry }>;
}> = ({ songEntry, SongAction }) => {
  const [songId, song] = songEntry;
  const secondaryAction = <SongAction songEntry={songEntry} />;
  const kind = siteKind(songId);
  return (
    <ListItem disablePadding secondaryAction={secondaryAction}>
      <Tooltip arrow title={siteNames[kind]} placement="left">
        <ListItemButton
          component="a"
          href={toURL(songId, song).href}
          target="_blank"
          rel="noopener"
        >
          <ListItemIcon sx={{ minWidth: "20px" }}>
            <SiteIcon kind={kind} />
          </ListItemIcon>
          <ListItemText>
            <Link component="span">{song.title}</Link>
            {!!song.key && (
              <Typography
                sx={{
                  display: "inline-block",
                  fontSize: ".86em",
                  textAlign: "center",
                  color: "#999",
                  backgroundColor: "#f2f2f2",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  ml: "4px",
                }}
              >
                {song.key > 0 ? `+${song.key}` : `${song.key}`}
              </Typography>
            )}
            <Typography sx={{ float: "right", color: "#999", fontSize: "1em" }}>
              {song.comment}
            </Typography>
          </ListItemText>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

const SongListOfArtist: React.FC<{
  artist: string;
  songEntries: SongEntry[];
  open?: boolean;
  songAction: React.FC<{ songEntry: SongEntry }>;
}> = ({ artist, songEntries, open: openInitial, songAction }) => {
  const [open, setOpen] = useState(openInitial ?? true);
  useEffect(() => setOpen(openInitial ?? true), [openInitial]);
  return (
    <Card sx={{ marginBottom: 2 }}>
      <ListItem disableGutters disablePadding>
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
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {songEntries.map((songEntry) => (
          <SongItem
            key={songEntry[0]}
            songEntry={songEntry}
            SongAction={songAction}
          />
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
  songAction: React.FC<{ songEntry: SongEntry }>;
}> = React.memo(({ data, collapsed, songAction }) => {
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
          songAction={songAction}
        />
      ))}
    </List>
  );
});

export default SongList;
