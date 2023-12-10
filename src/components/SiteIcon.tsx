import { SiteKind, siteNames } from "./utils";

const urls: Record<SiteKind, string> = {
  chordwiki: "/chordwiki.png",
  gakkime: "/gakkime.png",
  ufret: "/ufret.png",
  youtube: "/youtube.png",
};

const style = {
  width: "16px",
  height: "16px",
  marginRight: "4px",
};

const SiteIcon: React.FC<{ kind: SiteKind }> = ({ kind }) => (
  <img src={urls[kind]} alt={siteNames[kind]} style={style}></img>
);

export default SiteIcon;
