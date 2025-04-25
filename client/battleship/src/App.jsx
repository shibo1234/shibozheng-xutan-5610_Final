import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Register from "./pages/Register";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AllGames from "./pages/AllGames";
import HighScores from "./pages/HighScores";
import NewGame from "./pages/NewGamePage";
import GameRoomPage from "./pages/GameRoomPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((user) => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, []);
  return (
    <div>
      <h1>Battleship</h1>
      <NavBar currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} currentUser={currentUser} />} />
        <Route path="/register" element={<Register currentUser={currentUser} />} />
        <Route path="/games" element={<AllGames />} />
        <Route path="/high-scores" element={<HighScores />} />
        <Route path="/game/new" element={<NewGame />} />
        <Route path="/game/:gameId" element={<GameRoomPage />} />
      </Routes>
    </div>
  );
}

export default App;

