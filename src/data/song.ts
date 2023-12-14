import {
  DataSnapshot,
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  set,
} from "firebase/database";
import { database as db } from "../firebase";
import { root } from "./utils";

export interface Song {
  artist: string;
  title: string;
  key?: number;
  symbol?: string;
  comment?: string;
  createdAt?: number;
}

export type SongEntry = [songId: string, song: Song];

export function isSong(x: unknown): x is Song {
  return (
    typeof x === "object" &&
    x !== null &&
    "artist" in x &&
    typeof x.artist === "string" &&
    "title" in x &&
    typeof x.title === "string" &&
    "key" in x &&
    ["number", "undefined"].includes(typeof x.key) &&
    "symbol" in x &&
    ["string", "undefined"].includes(typeof x.symbol) &&
    "comment" in x &&
    ["string", "undefined"].includes(typeof x.comment) &&
    "createdAt" in x &&
    ["number", "undefined"].includes(typeof x.createdAt)
  );
}

export function unpartial(song: Partial<Song>): Song {
  return {
    ...song,
    artist: song.artist ?? "",
    title: song.title ?? "",
  };
}

function snapshotToSongs(snapshot: DataSnapshot): SongEntry[] {
  const songEntries: SongEntry[] = [];
  snapshot.forEach((child) => {
    const songId = child.key;
    const song = child.val();
    if (songId === null) throw new Error("Invalid ID: songId is null");
    if (!isSong(song))
      throw new Error("Type validation failed: a value of child is not song");
    songEntries.push([songId, song]);
  });
  return songEntries;
}

export async function watchSongs(
  userId: string,
  onSongsChange: (songEntries: SongEntry[]) => void
) {
  if (userId === "") throw new Error("invalid username");
  const songRef = ref(db, `${root}/users/${userId}/songs/`);
  onValue(query(songRef, orderByChild("createdAt")), (snapshot) => {
    const songEntries = snapshotToSongs(snapshot);
    onSongsChange(songEntries);
  });
}

export async function setSong(
  userId: string,
  songId: string,
  song: Song
): Promise<void> {
  return set(ref(db, `${root}/users/${userId}/songs/${songId}`), song);
}

export async function removeSong(userId: string, songId: string) {
  return remove(ref(db, `${root}/users/${userId}/songs/${songId}`));
}

export function onSongExists(
  userId: string,
  songId: string,
  callback: (songExists: boolean) => void
) {
  onValue(ref(db, `${root}/users/${userId}/songs/${songId}`), (snapshot) => {
    const songExists = snapshot.exists();
    callback(songExists);
  });
}

export async function watchSongsByScreenName(
  screenName: string,
  onSongsChange: (songEntries: SongEntry[]) => void
) {
  const lowerScreenName = screenName.toLocaleLowerCase();
  const path = `${root}/users`;
  const q = query(
    ref(db, path),
    orderByChild("screenName"),
    equalTo(lowerScreenName)
  );
  const snapshot = await get(q);
  if (!snapshot.exists()) throw new Error("Such screen name does not exist");
  const userId: string = Object.keys(snapshot.val())[0];
  watchSongs(userId, onSongsChange);
}
