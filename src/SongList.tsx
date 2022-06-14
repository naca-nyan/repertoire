import React, { useEffect, useMemo, useState } from "react";
import {
  Collapse,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore, OpenInNew } from "@mui/icons-material";
import { Song, songMap } from "./song";

interface Props {
  artist: string;
  songs: { url: string; title: string }[];
  open?: boolean;
}

function labelURL(url: string): string {
  let label = "";
  if (url.startsWith("https://ja.chordwiki.org/")) label = "ChordWiki";
  if (url.startsWith("https://www.ufret.jp/")) label = "U-FRET";
  const urlDecoded = decodeURIComponent(url);
  return label ? `${label} (${urlDecoded})` : urlDecoded;
}

function SongListItem(props: Props) {
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
          {songs.map(({ url, title }) => (
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
                </ListItemText>
              </Tooltip>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}

function SongList({
  data,
  filter,
  collapsed,
}: {
  data: Song[];
  filter: string;
  collapsed: boolean;
}) {
  const filtered = useMemo(
    () =>
      filter
        ? data.filter(
            ({ artist, title, url }) =>
              artist.includes(filter) || title.includes(filter)
          )
        : data,
    [filter]
  );
  const songsOf = songMap(filtered);
  const sorted = Array.from(songsOf.entries());
  return (
    <>
      {sorted.map(([k, v]) => (
        <SongListItem key={k} artist={k} songs={v} open={!collapsed} />
      ))}
    </>
  );
}

export default React.memo(SongList);
