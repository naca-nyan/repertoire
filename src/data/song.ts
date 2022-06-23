import { onValue, ref, set } from "firebase/database";
import { database } from "../firebase";

export interface Song {
  artist: string;
  title: string;
  url: string;
  comment?: string;
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

export type SongsUniqByArtist = {
  artist: string;
  songs: Omit<Song, "artist">[];
}[];

function omitArtist(song: Song): Omit<Song, "artist"> {
  const { title, url, comment } = song;
  return {
    title,
    url,
    comment,
  };
}

export function uniqByArtist(songs: Song[]): SongsUniqByArtist {
  const uniq = (xs: string[]) => Array.from(new Set(xs));
  const artists = uniq(songs.map(({ artist }) => artist));
  return artists.map((artist) => ({
    artist,
    songs: songs.filter((song) => song.artist === artist).map(omitArtist),
  }));
}

function isIterable(obj: any) {
  if (obj == null) return false;
  return typeof obj[Symbol.iterator] === "function";
}

function getValueOnce(path: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    onValue(
      ref(database, path),
      (snapshot) => resolve(snapshot.val()),
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}

const songPath = (userId: string) => `/users/${userId}/songs/`;

export async function getSongs(userId: string): Promise<Song[]> {
  const val = await getValueOnce(songPath(userId));
  if (!isIterable(val)) {
    throw new Error("value is not iterable");
  }
  const songs = Array.from(val).filter(isSong);
  return songs;
}

export async function setSongs(userId: string, songs: Song[]) {
  await set(ref(database, songPath(userId)), songs);
}
