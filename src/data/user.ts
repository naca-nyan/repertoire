import { User as AuthUser } from "firebase/auth";
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import { root } from "./utils";

export type User = AuthUser & {
  userId: string;
  screenName: string;
};

export function getScreenName(authuser: AuthUser): string {
  // FIXME: safe method to get screen name
  // @ts-ignore
  const screenName: string | undefined = authuser.reloadUserInfo?.screenName;
  return screenName ?? "";
}

export function setScreenName(uid: string, screenName: string): Promise<void> {
  const lowerScreenName = screenName.toLowerCase();
  return set(ref(database, `${root}/users/${uid}/screenName`), lowerScreenName);
}
