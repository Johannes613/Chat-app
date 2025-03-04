import React from "react";
import { auth, db } from "../config/firebase";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default function First() {
  const [movieList, setMovieList] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState();
  const [isAwarded, setIsAwarded] = useState(true);
  const [movieName, setMovieName] = useState(name);
  const [fileUpload, setFileUpload] = useState(null);
  const movieCollectionRef = collection(db, "Movies");

  //Get data
  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      const coreData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMovieList(coreData);
      console.log(coreData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  //Post data
  const addMovieList = async () => {
    try {
      const res = await addDoc(movieCollectionRef, {
        title: name,
        releaseDate: date,
        receivedAnOscar: isAwarded,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  //Delete Data
  const removeMovie = async (id) => {
    const movieDoc = doc(db, "Movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  // Update Data
  const updateMovie = async (id) => {
    const movieDoc = doc(db, "Movies", id);
    await updateDoc(movieDoc, { title: movieName });
    getMovieList();
  };
  return (
    <div>
      <br />
      <div>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Movie title..."
        />
        <input
          onChange={(e) => setDate(e.target.value)}
          type="number"
          placeholder="Release Date..."
        />
        <input
          onChange={(e) => setIsAwarded(e.target.checked)}
          type="checkbox"
          id="oscar"
          checked={isAwarded}
        />
        <label htmlFor="oscar">Received an Oscar</label>
        <input type="submit" onClick={addMovieList} />
      </div>
      {movieList.map((movie) => (
        <div key={movie.id}>
          <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
            {movie.title}
          </h1>
          <p>Date: {movie.releaseDate}</p>
          <button onClick={() => removeMovie(movie.id)}>Delete</button>
          <input
            placeholder="New movie name..."
            onChange={(e) => setMovieName(e.target.value)}
          />
          <button onClick={() => updateMovie(movie.id)}>Update</button>
        </div>
      ))}
      <br />
      <div>
        <input onChange={(e) => setFileUpload(e.target.files[0])} type="file" />
        <button>Upload</button>
      </div>
    </div>
  );
}
