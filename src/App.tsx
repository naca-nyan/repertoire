import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import TopPage from "./pages/TopPage";
import SongPage from "./pages/SongPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { defaultUserState, UserState, UserStateContext } from "./contexts/user";
import { signInWithRedirect, signOut as authSignOut } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "./firebase";

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(defaultUserState);

  function signIn() {
    signInWithRedirect(auth, provider);
  }

  function signOut() {
    authSignOut(auth).then(() => setUserState({ state: "signed out", signIn }));
  }

  auth.onAuthStateChanged((user) => {
    const userState: UserState =
      user === null
        ? { state: "signed out", signIn }
        : { state: "signed in", user, signOut };
    setUserState(userState);
  });

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
