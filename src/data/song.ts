import {
  DataSnapshot,
  equalTo,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  set,
} from "firebase/database";
import { database as db } from "../firebase";
import { sha256 } from "../utils/hash";
import { root } from "./utils";

export interface Song {
  artist: string;
  title: string;
  url: string;
  comment?: string;
  createdAt?: number;
}

export type Songs = [string, Song][];

export function isSong(x: any): x is Song {
  return (
    typeof x.artist === "string" &&
    typeof x.title === "string" &&
    typeof x.url === "string" &&
    ["string", "undefined"].includes(typeof x.comment) &&
    ["number", "undefined"].includes(typeof x.createdAt)
  );
}

export function unpartial(obj: Partial<Song>): Song {
  return {
    artist: obj.artist ?? "",
    title: obj.title ?? "",
    url: obj.url ?? "",
    comment: obj.comment,
  };
}

function getValueOnce(path: string, orderBy: string): Promise<DataSnapshot> {
  return new Promise((resolve, reject) => {
    onValue(query(ref(db, path), orderByChild(orderBy)), resolve, reject, {
      onlyOnce: true,
    });
  });
}

function snapshotToSongs(snapshot: DataSnapshot): Songs {
  const songs: Songs = [];
  snapshot.forEach((child) => {
    const songId = child.key;
    const song = child.val();
    if (songId === null) throw new Error("Invalid ID: songId is null");
    if (!isSong(song))
      throw new Error("Type validation failed: a value of child is not song");
    songs.push([songId, song]);
  });
  return songs;
}

async function getAllSongs(): Promise<Songs> {
  const snapshot = await getValueOnce(`${root}/songs/`, "createdAt");
  const songs = snapshotToSongs(snapshot);
  return songs;
}

export async function getSongsOfUser(userId: string): Promise<Songs> {
  const snapshot = await getValueOnce(
    `${root}/users/${userId}/songs/`,
    "createdAt"
  );
  const songs = snapshotToSongs(snapshot);
  return songs;
}

export async function getSongs(userId?: string): Promise<Songs> {
  if (userId === undefined) return await getAllSongs();
  if (userId === "") throw new Error("invalid username");
  return await getSongsOfUser(userId);
}

export async function pushSong(userId: string, song: Song): Promise<string> {
  // Use first 32 chars of SHA-256 hash
  const songId = (await sha256(song.url)).substring(0, 32);
  await setSong(userId, songId, song);
  return songId;
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

function getValueQueryOnce(
  path: string,
  target: string,
  value: string
): Promise<DataSnapshot> {
  return new Promise((resolve, reject) => {
    const q = query(ref(db, path), orderByChild(target), equalTo(value));
    onValue(q, resolve, reject, { onlyOnce: true });
  });
}

export async function getSongsByScreenName(screenName: string): Promise<Songs> {
  const snapshot = await getValueQueryOnce(
    `${root}/users`,
    "screenName",
    screenName
  );
  if (!snapshot.exists()) throw new Error("Such screen name does not exist");
  let userId: string = "";
  snapshot.forEach((child) => {
    userId = child.key ?? "";
  });
  return getSongs(userId);
}
