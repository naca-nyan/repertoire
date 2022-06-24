import { createContext } from "react";
import { User } from "../data/user";

export type UserState =
  | { state: "loading" }
  | { state: "signed out"; signIn: () => void }
  | { state: "signed in"; user: User; signOut: () => void };

export const defaultUserState: UserState = {
  state: "loading",
};

export const UserStateContext = createContext<UserState>(defaultUserState);
