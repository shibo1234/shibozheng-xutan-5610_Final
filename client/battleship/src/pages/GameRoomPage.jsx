import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../components/Board";

export default function GamePage() {
  const { gameId } = useParams(); 
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load game.");
        }

        const data = await res.json();
        setGame(data);

        if (data.status === "Open") {
          console.log("Game is open, trying to join...");

          const joinRes = await fetch(`/api/games/${gameId}/join`, {
            method: "POST",
            credentials: "include",
          });

          if (!joinRes.ok) {
            const joinText = await joinRes.text();
            console.error("Join failed:", joinText);
            return;
          }

          const updatedGame = await joinRes.json();
          console.log("Successfully joined the game:", updatedGame);
          setGame(updatedGame);
        }
      } catch (err) {
        console.error("Fetch or join error:", err);
        setError(err.message);
      }
    };

    fetchGame();
  }, [gameId]);

  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>Loading game...</div>;

  return (
    <div>
        <div>
        <h2>Game: {game._id}</h2>
        <p>Status: {game.status}</p>
        <p>Turn: {game.turn}</p>
        <p>Winner: {game.winner || "None yet"}</p>

        <div style={{ display: "flex", gap: "40px" }}>
            {game.board1 && <Board board={game.board1} title="Player 1 Board" />}
            {game.board2 && <Board board={game.board2} title="Player 2 Board" />}
        </div>
        </div>
    </div>
  );
}
