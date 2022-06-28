import {
  child,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { database as db } from "../firebase";

export interface Song {
  artist: string;
  title: string;
  url: string;
  comment?: string;
}

export interface Songs {
  [songId: string]: Song;
}

function isSong(x: any): x is Song {
  return (
    typeof x.artist === "string" &&
    typeof x.title === "string" &&
    typeof x.url === "string" &&
    ["string", "undefined"].includes(typeof x.comment)
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

const root = "/v1";

function getValueOnce(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    onValue(
      ref(db, path),
      (snapshot) => resolve(snapshot.val()),
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}

async function getAllSongs(): Promise<Songs> {
  const val = await getValueOnce(`${root}/songs/`);
  if (!Object.values(val).every(isSong))
    throw new Error("Type validation failed: a value of songs is not song");
  return val;
}

export async function getSongsOfUser(userId: string): Promise<Songs> {
  const val = await getValueOnce(`${root}/users/${userId}/songs/`);
  if (!Object.values(val).every(isSong))
    throw new Error("Type validation failed: a value of songs is not song");
  return val;
}

export async function getSongs(userId?: string): Promise<Songs> {
  if (userId === undefined) return await getAllSongs();
  if (userId === "") throw new Error("invalid username");
  return await getSongsOfUser(userId);
}

export async function pushSong(userId: string, song: Song): Promise<string> {
  const key = push(child(ref(db), `${root}/songs`)).key;
  if (key === null) throw new Error("could not push song; key is null");
  const updates = {
    [`${root}/songs/${key}`]: song,
    [`${root}/users/${userId}/songs/${key}`]: song,
  };
  await update(ref(db), updates);
  return key;
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
