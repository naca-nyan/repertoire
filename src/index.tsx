import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import App from "./App";
import TopPage from "./pages/TopPage";
import SongPage from "./pages/SongPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import { defaultUserState, UserState, UserStateContext } from "./contexts/user";
import { signInWithRedirect, signOut as authSignOut } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "./firebase";

const Root: React.FC = () => {
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
          <Route path="/" element={<App />}>
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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
