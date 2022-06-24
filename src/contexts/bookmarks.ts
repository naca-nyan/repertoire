import { createContext } from "react";

type SongId = string;
type Bookmarks = SongId[];

export const BookmarksContext = createContext<Bookmarks>([]);
