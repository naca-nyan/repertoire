import { User as AuthUser } from "firebase/auth";

export type User = AuthUser & {
  userId: string;
};

export function getScreenName(authuser: AuthUser): string | null {
  // FIXME: safe method to get screen name
  // @ts-ignore
  const screenName: string | undefined = authuser.reloadUserInfo?.screenName;
  return screenName || null;
}
