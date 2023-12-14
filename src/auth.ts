import * as Auth from "firebase/auth";
import { auth, provider } from "./firebase";
import { getScreenName, setScreenName } from "./data/user";

export const signIn = async () => {
  await Auth.signInWithRedirect(auth, provider);
};

export const signOut = async () => {
  await Auth.signOut(auth);
  window.location.href = "/";
};

export const setOrGetScreenName = async (user: Auth.User) => {
  const userId = user.uid;
  const userCredential = await Auth.getRedirectResult(auth);
  if (userCredential) {
    await updateProfile(user);

    const additionalUserInfo = Auth.getAdditionalUserInfo(userCredential);
    const screenName = additionalUserInfo?.username;
    if (!screenName) throw new Error("invalid screenName");
    await setScreenName(userId, screenName);
    return screenName;
  } else {
    const screenName = await getScreenName(userId);
    return screenName;
  }
};

const updateProfile = async (user: Auth.User) => {
  for (const data of user.providerData) {
    if (data.providerId === "twitter.com") {
      const newProfile: {
        displayName?: string;
        photoURL?: string;
      } = {};
      const photoURL = data.photoURL;
      if (photoURL && photoURL !== user.photoURL)
        newProfile.photoURL = photoURL;
      const displayName = data.displayName;
      if (displayName && displayName !== user.displayName)
        newProfile.displayName = displayName;

      if (Object.keys(newProfile).length > 0)
        Auth.updateProfile(user, newProfile);
    }
  }
};
