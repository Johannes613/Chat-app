import React, { useEffect, useState } from "react";
import "./ChatList.css";
import search from "../../images/search.png";
import add from "../../images/plus.png";
import minus from "../../images/minus.png";
import avatar from "../../images/avatar.png";
import AddUser from "../add/AddUser";
import { useUserStore } from "../../config/userStore";
import { db } from "../../config/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { usechatStore } from "../../config/chatStore";

export default function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { changeChat } = usechatStore();

  useEffect(() => {
    const docRef = doc(db, "userchats", currentUser.id);
    const unSub = onSnapshot(docRef, async (snapShot) => {
      const chatData = snapShot.data()?.chats || [];

      const promises = chatData.map(async (item) => {
        const itemRef = doc(db, "users", item.receiverId);
        const userDoc = await getDoc(itemRef);
        const user = userDoc.data();
        return { ...item, user };
      });

      const dataRes = await Promise.all(promises);
      setChats(dataRes.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    changeChat(chat?.chatId, chat?.user, currentUser);

    const userChatRef = doc(db, "userchats", currentUser.id);
    const userChatSnap = await getDoc(userChatRef);

    if (userChatSnap.exists()) {
      const chats = userChatSnap.data().chats;

      const updatedChats = chats.map((c) =>
        c.chatId === chat.chatId ? { ...c, isSeen: true } : c
      );

      await updateDoc(userChatRef, { chats: updatedChats });
    }
  };

  return (
    <div className="chat-list">
      <div className="search">
        <div className="search-bar">
          <img className="search-icon" src={search} alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          onClick={() => setAddMode((prev) => !prev)}
          src={addMode ? minus : add}
          alt=""
          className="add"
        />
      </div>

      {chats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img src={chat.user.avatar || avatar} alt="" />
          <div className="over-texts">
            <h3>{chat.user.username}</h3>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
}
