import React, { useState } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export default function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log(auth?.currentUser?.email);
  // console.log(auth?.currentUser?.photoURL);
  const signIn = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const logOut = async () => {
    try {
      const result = await signOut(auth);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email.."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password. ."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>SignIn</button>
      <button onClick={signInWithGoogle}>SignIn With Google</button>
      <button onClick={logOut}>LogOut</button>
    </div>
  );
}
