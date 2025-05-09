import React from "react";
import "./List.css";
import ChatList from "../chatList/ChatList";
import UserInfo from "../userInfo/UserInfo";

export default function List() {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
}
