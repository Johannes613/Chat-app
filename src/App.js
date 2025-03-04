import React, { useEffect, useState } from "react";
import "./App.css";
import Chat from "./components/chat/Chat";
import List from "./components/list/List";
import Detail from "./components/detail/Detail";
import SignIn from "./components/login/SignIn";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { useUserStore } from "./config/userStore";
import { usechatStore } from "./config/chatStore";

function App() {
  const { currentUser, isLoading, refreshApp, fetchUserInfo } = useUserStore();
  const { chatId } = usechatStore();
  const [hideDetail, setHideDetail] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => unsubscribe();
  }, [fetchUserInfo, refreshApp]);

  if (isLoading) return <div className="loading-pup-up">Loading...</div>;
  return (
    <div className="container">
      {currentUser ? (
        <>
          <List hideDetail={hideDetail} setHideDetail={setHideDetail} />
          {chatId && (
            <Chat hideDetail={hideDetail} setHideDetail={setHideDetail} />
          )}
          {chatId && (
            <Detail hideDetail={hideDetail} setHideDetail={setHideDetail} />
          )}
        </>
      ) : (
        <SignIn />
      )}
      <Notification />
    </div>
  );
}

export default App;
