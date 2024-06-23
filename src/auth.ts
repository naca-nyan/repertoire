import {
  signInWithPopup,
  signOut as authSignOut,
  User,
  updateProfile as authUpdateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth, provider } from "./firebase";
import { setScreenName } from "./data/user";

export const signIn = async () => {
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  const userId = user.uid;
  await updateProfile(user);
  const additionalUserInfo = getAdditionalUserInfo(userCredential);
  const screenName = additionalUserInfo?.username;
  if (!screenName) throw new Error("invalid screenName");
  await setScreenName(userId, screenName);
};

export const signOut = async () => {
  await authSignOut(auth);
  window.location.href = "/";
};

const updateProfile = async (user: User) => {
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
        authUpdateProfile(user, newProfile);
    }
  }
};
