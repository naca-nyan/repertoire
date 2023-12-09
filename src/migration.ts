import { DataSnapshot, onValue, ref, update } from "firebase/database";
import { database } from "./firebase";

function getDataSnapshotOnce(path: string): Promise<DataSnapshot> {
  return new Promise((resolve, reject) =>
    onValue(ref(database, path), resolve, reject, { onlyOnce: true })
  );
}

function updateSong(oldId: string, url: URL, song: any) {
  if (url.host === "ja.chordwiki.org") {
    // https://ja.chordwiki.org/wiki/%E3%81%8B%E3%82%89%E3%81%8F%E3%82%8A%E3%83%94%E3%82%A8%E3%83%AD
    if (url.pathname.startsWith("/wiki/")) {
      const name = decodeURIComponent(
        url.pathname.replace("/wiki/", "")
      ).replaceAll("+", " ");
      delete song.url;
      return [`chordwiki:${name}`, song];
    }
    // https://ja.chordwiki.org/wiki.cgi?c=view&t=%E3%83%8B%E3%83%A3%E3%83%BC%E3%82%B9%E3%81%AE%E3%81%86%E3%81%9F&key=2&symbol=
    if (url.pathname.startsWith("/wiki.cgi")) {
      const id = decodeURIComponent(url.searchParams.get("t") ?? "");
      const newSong = { ...song };
      if (url.searchParams.get("key")) {
        newSong.key = parseInt(url.searchParams.get("key") ?? "0");
      }
      if (url.searchParams.get("symbol")) {
        newSong.symbol = url.searchParams.get("symbol");
      }
      delete newSong.url;
      return [`chordwiki:${id}`, newSong];
    }
  }
  if (url.host === "gakufu.gakki.me") {
    // https://gakufu.gakki.me/m/data/N13285.html
    if (url.pathname.endsWith(".html")) {
      const filename = url.pathname.split("/").pop() ?? "";
      const id = filename.replace(".html", "");
      delete song.url;
      return [`gakkime:${id}`, song];
    }
    // https://gakufu.gakki.me/p/index.php?p=N12380&k=#rpA
    if (url.pathname.endsWith(".php")) {
      const id = url.searchParams.get("p");
      delete song.url;
      return [`gakkime:${id}`, song];
    }
  }
  // https://www.ufret.jp/song.php?data=92548
  if (url.host === "www.ufret.jp") {
    const id = url.searchParams.get("data");
    delete song.url;
    return [`ufret:${id}`, song];
  }
  // https://www.youtube.com/watch?v=TkroHwQYpFE
  if (url.host === "www.youtube.com") {
    const id = url.searchParams.get("v");
    delete song.url;
    return [`youtube:${id}`, song];
  }
  console.warn(url.href);
  return [oldId, song];
}

export async function migrate() {
  const root = "/v1";
  const newRoot = "/v2";
  const snapshot = await getDataSnapshotOnce(root + "/users");
  snapshot.forEach((user) => {
    const uid = user.key ?? "unknown";
    const songs = user.child("songs").val();
    if (!songs) return;
    const updatedSongs = Object.entries(songs).map(([songId, song]) => {
      const songAny = song as any;
      return updateSong(songId, new URL(songAny.url), songAny);
    });
    const lowerScreenName = user.child("screenName").val().toLowerCase();
    const updates = {
      [`${newRoot}/users/${uid}/songs`]: Object.fromEntries(updatedSongs),
      [`${newRoot}/users/${uid}/screenName`]: lowerScreenName,
    };
    update(ref(database), updates);
  });
}
