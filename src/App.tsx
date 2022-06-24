import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import TopPage from "./pages/TopPage";
import SongPage from "./pages/SongPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { defaultUserState, UserState, UserStateContext } from "./contexts/user";
import { signInWithRedirect, signOut as authSignOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { getScreenName } from "./data/user";

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(defaultUserState);

  useEffect(() => {
    const signIn = () => signInWithRedirect(auth, provider);
    const signOut = () =>
      authSignOut(auth).then(() =>
        setUserState({ state: "signed out", signIn })
      );
    auth.onAuthStateChanged((authUser) => {
      let userState: UserState;
      if (authUser === null) {
        userState = { state: "signed out", signIn };
      } else {
        const userId = getScreenName(authUser) ?? authUser.uid;
        const user = { ...authUser, userId };
        userState = { state: "signed in", user, signOut };
      }
      setUserState(userState);
    });
  }, []);

  return (
    <UserStateContext.Provider value={userState}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppHeader />}>
            <Route path="" element={<TopPage />} />
            <Route path="users/:userId" element={<SongPage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserStateContext.Provider>
  );
};

export default App;
