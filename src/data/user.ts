import { get, ref, set } from "firebase/database";
import { database } from "../firebase";
import { root } from "./utils";

export type UserInfo = {
  userId: string;
  displayName: string;
  screenName: string;
  photoURL: string;
};

export async function getScreenName(userId: string): Promise<string> {
  const snapshot = await get(
    ref(database, `${root}/users/${userId}/screenName`)
  );
  const screenName = snapshot.val() as unknown;
  if (typeof screenName !== "string")
    throw new Error("Stored screenName is not string");
  return screenName;
}

export async function setScreenName(
  userId: string,
  screenName: string
): Promise<void> {
  await set(ref(database, `${root}/users/${userId}/screenName`), screenName);
  const screenNameLowerCase = screenName.toLowerCase();
  await set(
    ref(database, `${root}/users/${userId}/screenNameLowerCase`),
    screenNameLowerCase
  );
}
