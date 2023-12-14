import { User as AuthUser } from "firebase/auth";
import { ref, set } from "firebase/database";
import { database } from "../firebase";
import { root } from "./utils";

export type User = AuthUser & {
  userId: string;
  screenName: string;
};

export function getScreenName(authuser: AuthUser): string {
  // FIXME: better method to get screen name
  if (!("reloadUserInfo" in authuser)) return "";
  const reloadUserInfo = authuser.reloadUserInfo;
  if (
    typeof reloadUserInfo !== "object" ||
    reloadUserInfo === null ||
    !("screenName" in reloadUserInfo)
  )
    return "";
  const screenName = reloadUserInfo.screenName;
  if (typeof screenName !== "string") return "";
  return screenName;
}

export function setScreenName(uid: string, screenName: string): Promise<void> {
  const lowerScreenName = screenName.toLowerCase();
  return set(ref(database, `${root}/users/${uid}/screenName`), lowerScreenName);
}
