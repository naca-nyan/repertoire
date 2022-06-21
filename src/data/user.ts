import { User } from "firebase/auth";

export function getScreenName(user: User): string | undefined {
  // FIXME: safe method to get screen name
  // @ts-ignore
  const userId: string | undefined = user.reloadUserInfo?.screenName;
  return userId;
}
