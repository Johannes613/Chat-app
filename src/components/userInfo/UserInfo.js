import React from "react";
import "./UserInfo.css";
import avatar from "../../images/avatar.png";
import more from "../../images/more.png";
import edit from "../../images/edit.png";
import video from "../../images/video.png";
import { useUserStore } from "../../config/userStore";

export default function UserInfo() {
  const { currentUser } = useUserStore();

  return (
    <div className="user-info">
      <div className="user">
        <img src={currentUser?.avatar || avatar} alt="" />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className="icons">
        <img src={more} alt="" />
        <img src={video} alt="" />
        <img src={edit} alt="" />
      </div>
    </div>
  );
}
