import React, { useRef, useState } from "react";
import "./SignIn.css";
import google from "../../images/image.png";
import avatar from "../../images/avatar.png";
import { toast } from "react-toastify";
import { db, auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import upload from "../upload/Upload";
import { useUserStore } from "../../config/userStore";

export default function SignIn() {
  const [accState, setAccState] = useState("Sign-in");
  const formRef = useRef(null);
  const { triggerRefresh } = useUserStore();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    file: null,
    url: "",
  });

  const handleProfile = (e) => {
    setProfile({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(profile?.file);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        password,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created! You can login now!");
      triggerRefresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        await setDoc(userDoc, {
          username: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          id: user.uid,
          blocked: [],
        });

        await setDoc(doc(db, "userchats", user.uid), {
          chats: [],
        });
      }

      toast.success("You logged in with Google!");
      triggerRefresh();
    } catch (error) {
      toast.error(`Google Sign-In failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(formRef.current);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("You Logged in!");
      triggerRefresh();
    } catch (error) {
      handleGoogle();
      toast.error(error.message + "Directing to Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-cont">
        <h2 className="login-head">{accState} to ChatNova</h2>

        {accState === "Sign-in" && (
          <button
            className="google-auth"
            onClick={handleGoogle}
            disabled={loading}
          >
            <img src={google} alt="" /> {accState} with Google
          </button>
        )}

        <form ref={formRef}>
          {accState === "Sign-up" && (
            <div className="info-input">
              <div className="profile">
                <img src={profile.url ? profile.url : avatar} alt="" />
                <label htmlFor="avatar">Upload an avatar</label>
                <input
                  onChange={handleProfile}
                  style={{ display: "none" }}
                  id="avatar"
                  type="file"
                  name="avatar"
                />
              </div>
              <input
                type="text"
                placeholder="Username"
                autoComplete="on"
                name="username"
                required
              />
            </div>
          )}

          <div className="info-input">
            <input
              type="email"
              aria-autocomplete="on"
              placeholder="Email"
              name="email"
              autoComplete="on"
              required
            />
          </div>

          <div className="info-input">
            <input
              type="password"
              placeholder="Password"
              autoComplete="on"
              name="password"
              required
            />
          </div>

          <button
            onClick={accState === "Sign-up" ? handleSignUp : handleSignIn}
            className="sub-btn"
            disabled={loading}
          >
            {loading
              ? "Loading"
              : accState === "Sign-up"
              ? "Create Account"
              : "Sign in"}
          </button>

          {accState === "Sign-up" ? (
            <div className="check-out">
              <p>
                Already have an account?{" "}
                <span onClick={() => setAccState("Sign-in")}>Sign In</span>
              </p>
            </div>
          ) : (
            <div className="check-out">
              <p>
                Don't have an account?{" "}
                <span onClick={() => setAccState("Sign-up")}>Sign Up</span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
