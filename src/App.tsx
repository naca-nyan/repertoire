import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import TopPage from "./pages/TopPage";
import UserPage from "./pages/UserPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { defaultUserState, UserState, UserStateContext } from "./contexts/user";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { getScreenName } from "./data/user";

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(defaultUserState);

  const handleChangeAuth = async (user: User | null) => {
    if (user === null) {
      setUserState({ state: "signedOut" });
    } else {
      const screenName = await getScreenName(user.uid);
      const displayName = user.displayName ?? "";
      const userId = user.uid;
      const photoURL = user.photoURL ?? "";
      const userInfo = { screenName, userId, displayName, photoURL };
      setUserState({ state: "signedIn", user: userInfo });
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleChangeAuth);
    return unsubscribe;
  }, []);

  return (
    <UserStateContext.Provider value={userState}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContainer />}>
            <Route path="" element={<TopPage />} />
            <Route path="users/:screenName" element={<UserPage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserStateContext.Provider>
  );
};

export default App;
