import { SiteKind, siteNames } from "./utils";

const urls: Record<SiteKind, string> = {
  chordwiki: "/chordwiki.png",
  gakkime: "/gakkime.png",
  ufret: "/ufret.png",
  youtube: "/youtube.png",
};

const SiteIcon: React.FC<{ kind: SiteKind }> = ({ kind }) => (
  <img src={urls[kind]} alt={siteNames[kind]} />
);

export default SiteIcon;
