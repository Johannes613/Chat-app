import React, { useState } from "react";
import avatar from "../../images/avatar.png";
import "./AddUser.css";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useUserStore } from "../../config/userStore";

export default function AddUser() {
  const [userSearched, setUserSearched] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username } = Object.fromEntries(formData);

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const usersFound = await getDocs(q);
      if (
        !usersFound.empty &&
        usersFound.docs[0].data().id !== currentUser.id
      ) {
        setUserSearched(usersFound.docs[0].data());
      } else {
        setUserSearched(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    if (!userSearched) return;

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    const currentUserChatsDocRef = doc(userChatsRef, currentUser.id);
    const userSearchedChatsDocRef = doc(userChatsRef, userSearched.id);

    try {
      const currentUserChatsSnap = await getDoc(currentUserChatsDocRef);

      if (currentUserChatsSnap.exists()) {
        const userChatsData = currentUserChatsSnap.data();
        const chatExists = userChatsData.chats?.some(
          (chat) => chat.receiverId === userSearched.id
        );

        if (chatExists) {
          alert("Chat already exists with this user!");
          return;
        }
      } else {
        await setDoc(currentUserChatsDocRef, { chats: [] });
      }
      const userSearchedChatsSnap = await getDoc(userSearchedChatsDocRef);
      if (!userSearchedChatsSnap.exists()) {
        await setDoc(userSearchedChatsDocRef, { chats: [] });
      }

      const newChatsRef = doc(chatRef);
      await setDoc(newChatsRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const newChatData = {
        chatId: newChatsRef.id,
        lastMessage: "",
        receiverId: userSearched.id,
        updatedAt: Date.now(),
      };

      await updateDoc(currentUserChatsDocRef, {
        chats: arrayUnion(newChatData),
      });

      await updateDoc(userSearchedChatsDocRef, {
        chats: arrayUnion({
          ...newChatData,
          receiverId: currentUser.id,
        }),
      });

      alert("User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  return (
    <div className="add-user">
      <h3>Add new user</h3>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>

      {userSearched && (
        <div className="user">
          <div className="search-result">
            <div className="search-detail">
              <img src={userSearched.avatar || avatar} alt="" />
              <p>{userSearched.username}</p>
            </div>
            <button onClick={handleAdd}>Add User</button>
          </div>
        </div>
      )}
    </div>
  );
}
