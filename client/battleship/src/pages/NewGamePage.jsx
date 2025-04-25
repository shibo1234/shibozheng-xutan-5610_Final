import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewGame() {
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (created) {
      return;
    }

    const createGame = async () => {
      try {
        const res = await fetch("/api/games/new", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to create game.");
        }

        const game = await res.json();
        console.log("New game created:", game);
        setGameId(game._id);
        setCreated(true);
      } catch (err) {
        console.error("New game error:", err);
        setError(err.message);
      }
    };
    createGame();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!gameId) return <div>Creating your game...</div>;

  return (
    <div>
      <h2>Game Created!</h2>
      <p>Game ID: {gameId}</p>
      <button onClick={() => navigate(`/game/${gameId}`)}>Go to Game</button>
    </div>
  );
}
