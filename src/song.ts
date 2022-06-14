export interface Song {
  artist: string;
  title: string;
  url: string;
}

function makeSong(obj: Partial<Song>): Song {
  return {
    artist: obj.artist ?? "",
    title: obj.title ?? "",
    url: obj.url ?? "",
  };
}

export function songMap(data: Song[]): Map<string, Song[]> {
  const map = data.reduce((map, obj) => {
    const song = makeSong(obj);
    const songs = map.get(song.artist) ?? [];
    map.set(song.artist, [...songs, song]);
    return map;
  }, new Map());
  return map;
}
