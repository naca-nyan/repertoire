export const songIdPrefixes = [
  "chordwiki",
  "gakkime",
  "ufret",
  "youtube",
] as const;

export type SiteKind = (typeof songIdPrefixes)[number];

export const siteNames: Record<SiteKind, string> = {
  chordwiki: "ChordWiki",
  gakkime: "楽器.me",
  ufret: "U-FRET",
  youtube: "YouTube",
};

export function siteKind(songId: string): SiteKind {
  for (const p of songIdPrefixes) {
    if (songId.startsWith(p + ":")) {
      return p;
    }
  }
  throw new Error("Unknown songId");
}

export function fromURL(url: URL): {
  songId: string;
  key?: number;
  symbol?: string;
} {
  if (url.host === "ja.chordwiki.org") {
    // https://ja.chordwiki.org/wiki/%E3%81%8B%E3%82%89%E3%81%8F%E3%82%8A%E3%83%94%E3%82%A8%E3%83%AD
    if (url.pathname.startsWith("/wiki/")) {
      const idEncoded = url.pathname.split("/").pop() ?? "";
      const id = decodeURIComponent(idEncoded).replaceAll("+", " ");
      if (!id) throw new Error("Empty songId parsing ja.chordwiki.org");
      return { songId: `chordwiki:${id}` };
    }
    // https://ja.chordwiki.org/wiki.cgi?c=view&t=%E3%83%8B%E3%83%A3%E3%83%BC%E3%82%B9%E3%81%AE%E3%81%86%E3%81%9F&key=2&symbol=
    if (url.pathname.startsWith("/wiki.cgi")) {
      const id = decodeURIComponent(url.searchParams.get("t") ?? "");
      const key = parseInt(url.searchParams.get("key") ?? "0");
      const symbol = url.searchParams.get("symbol");
      if (!id)
        throw new Error(
          "Empty songId parsing ja.chordwiki.org with key or symbol"
        );
      return {
        songId: `chordwiki:${id}`,
        key: key || undefined,
        symbol: symbol || undefined,
      };
    }
  }
  if (url.host === "gakufu.gakki.me") {
    // https://gakufu.gakki.me/m/data/N13285.html
    if (url.pathname.endsWith(".html")) {
      const filename = url.pathname.split("/").pop() ?? "";
      const id = filename.replace(".html", "");
      if (!id) throw new Error("Empty songId parsing gakufu.gakki.me");
      return { songId: `gakkime:${id}` };
    }
    // https://gakufu.gakki.me/p/index.php?p=N12380&k=#rpA
    if (url.pathname.endsWith(".php")) {
      const id = url.searchParams.get("p");
      const keyText = url.searchParams.get("k") ?? "";
      const key = parseInt(keyText.replace("m", "-").replace("p", "+"));
      if (!id) throw new Error("Empty songId parsing gakufu.gakki.me with key");
      return { songId: `gakkime:${id}`, key: key || undefined };
    }
  }
  // https://www.ufret.jp/song.php?data=92548
  if (url.host === "www.ufret.jp") {
    const id = url.searchParams.get("data");
    if (!id) throw new Error("Empty songId parsing www.ufret.jp");
    return { songId: `ufret:${id}` };
  }
  // https://www.youtube.com/watch?v=TkroHwQYpFE
  if (url.host === "www.youtube.com") {
    const id = url.searchParams.get("v");
    if (!id) throw new Error("Empty songId parsing www.youtube.com");
    return { songId: `youtube:${id}` };
  }
  throw new Error("Unknown url " + url.href);
}

export function toURL(
  songId: string,
  option?: { key?: number; symbol?: string }
): URL {
  const { key, symbol } = option ?? {};
  if (songId.startsWith("chordwiki:")) {
    const id = songId.replace("chordwiki:", "");
    const url = new URL("https://ja.chordwiki.org");
    if (key || symbol) {
      url.pathname = "/wiki.cgi";
      url.searchParams.set("c", "view");
      url.searchParams.set("t", id);
      url.searchParams.set("key", key?.toString() ?? "");
      url.searchParams.set("symbol", symbol ?? "");
      return url;
    }
    url.pathname = "/wiki/" + encodeURIComponent(id).replaceAll("%20", "+");
    return url;
  }
  if (songId.startsWith("gakkime:")) {
    const id = songId.replace("gakkime:", "");
    const url = new URL("https://gakufu.gakki.me/m/index.php");
    url.searchParams.set("p", id);
    if (key) url.searchParams.set("k", key.toString());
    return url;
  }
  if (songId.startsWith("ufret:")) {
    const id = songId.replace("ufret:", "");
    const url = new URL("https://www.ufret.jp/song.php");
    url.searchParams.set("data", id);
    return url;
  }
  if (songId.startsWith("youtube:")) {
    const id = songId.replace("youtube:", "");
    const url = new URL("https://www.youtube.com/watch");
    url.searchParams.set("v", id);
    return url;
  }
  throw new Error("Unknown songId");
}
