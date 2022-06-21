import { onValue, ref, set } from "firebase/database";
import { database } from "../firebase";

export interface Song {
  artist: string;
  title: string;
  url: string;
  comment?: string;
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

const songPath = (userId: string) => `/users/${userId}/songs/`;

export function getSongs(userId: string): Promise<Song[] | null> {
  return new Promise((resolve, reject) => {
    onValue(
      ref(database, songPath(userId)),
      (snapshot) => {
        const songs = snapshot.val();
        resolve(songs);
      },
      (error) => reject(error),
      { onlyOnce: true }
    );
  });
}

export async function setSongs(userId: string, songs: Song[]) {
  await set(ref(database, songPath(userId)), songs);
}
