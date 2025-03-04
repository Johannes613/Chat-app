import React from "react";
import "./Detail.css";
import avatar from "../../images/avatar.png";
import arrowUp from "../../images/arrowUp.png";
import sample from "../../images/bg.jpg";
import downloadIcon from "../../images/download.png";
import { auth } from "../../config/firebase";
import { usechatStore } from "../../config/chatStore";

export default function Detail({ hideDetail, setHideDetail }) {
  const { chatId, user } = usechatStore();

  return (
    <div className={`${hideDetail ? "hide" : "show"} detail `}>
      <div className="user-detail">
        <img src={user?.avatar} alt="" />
        <h3>{user?.username}</h3>
        <p>Grateful for every sunrise and sunset</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <p>Chat Setting</p>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <p>Privacy & help</p>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <p>Shared photos</p>
            <img src={arrowUp} alt="" />
          </div>
          <div className="content-detail">
            <div className="photos">
              <div className="photo-item">
                <img src={sample} alt="" />
                <p>photo_2025_1.png</p>
              </div>
              <img className="download" src={downloadIcon} alt="" />
            </div>
            <div className="photos">
              <div className="photo-item">
                <img src={sample} alt="" />
                <p>photo_2025_1.png</p>
              </div>
              <img className="download" src={downloadIcon} alt="" />
            </div>
            <div className="photos">
              <div className="photo-item">
                <img src={sample} alt="" />
                <p>photo_2025_2.png</p>
              </div>
              <img className="download" src={downloadIcon} alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <p>Shared files</p>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <button className="block-user">Block User</button>
        <button className="log-out" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
}
