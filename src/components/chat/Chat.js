import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import avatar from "../../images/avatar.png";
import phone from "../../images/phone.png";
import video from "../../images/video.png";
import info from "../../images/info.png";
import image from "../../images/img.png";
import camera from "../../images/camera.png";
import mic from "../../images/mic.png";
import emoji from "../../images/emoji.png";
import { IoMdSend } from "react-icons/io";

import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { usechatStore } from "../../config/chatStore";
import { useUserStore } from "../../config/userStore";

export default function Chat({ hideDetail, setHideDetail }) {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState("");
  const toEnd = useRef(null);
  const { chatId, user } = usechatStore();
  const { currentUser } = useUserStore();
  const iconToggle = useRef(null);

  useEffect(() => {
    toEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res?.data());
    });
    return () => {
      unsubscribe();
    };
  }, [chatId]);

  const updateUserChats = async (messageText) => {
    const userIds = [currentUser.id, user.id];

    for (const id of userIds) {
      const userChatRef = doc(db, "userchats", id);
      const userChatSnap = await getDoc(userChatRef);

      if (userChatSnap.exists()) {
        const chats = userChatSnap.data().chats;

        const updatedChats = chats.map((c) =>
          c.chatId === chatId
            ? {
                ...c,
                lastMessage: messageText,
                isSeen: id === currentUser.id,
              }
            : c
        );

        await updateDoc(userChatRef, { chats: updatedChats });
      }
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
      }),
    });

    await updateUserChats(text);
    setText("");
  };

  const handleDetailIcon = () => {
    setHideDetail((prev) => !prev);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar} alt="" />
          <div className="user-pro">
            <h3>{user?.username}</h3>
            <p>Always Grateful</p>
          </div>
        </div>
        <div className="chat-icons">
          <img src={phone} alt="" />
          <img src={video} alt="" />
          <img id="hide-me" onClick={handleDetailIcon} src={info} alt="" />
        </div>
      </div>

      <div className="middle">
        {chat?.messages?.map((message, index) => (
          <div
            className={
              message.senderId === currentUser.id ? "message own" : "message"
            }
            key={index}
          >
            {message.senderId !== currentUser.id && (
              <img src={user?.avatar} alt="" />
            )}
            <div className="texts">
              {message.image && <img src={message.image} alt="" />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={toEnd}></div>
      </div>

      <div className="bottom">
        <div className="message-icons">
          <img src={image} alt="" />
          <img src={camera} alt="" />
          <img src={mic} alt="" />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <div className="emoji">
          <img
            src={emoji}
            alt=""
            onClick={() => setOpenEmoji((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button onClick={handleSend} className="sendButton">
          <IoMdSend />
        </button>
      </div>
    </div>
  );
}
