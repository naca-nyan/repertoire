import { createContext } from "react";
import { UserInfo } from "../data/user";

export type UserState =
  | { state: "loading" }
  | { state: "signedOut" }
  | { state: "signedIn"; user: UserInfo };

export const defaultUserState: UserState = {
  state: "loading",
};

export const UserStateContext = createContext<UserState>(defaultUserState);
