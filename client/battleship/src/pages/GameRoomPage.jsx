import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../components/Board";

export default function GamePage() {
  const { gameId } = useParams(); 
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };

    fetchUser();
  }, []);

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

          if (joinRes.ok) {
            const updatedGame = await joinRes.json();
            console.log("Successfully joined the game:", updatedGame);
            setGame(updatedGame);
          } else {
            const joinText = await joinRes.text();
            console.error("Join failed:", joinText);
          }
        }
      } catch (err) {
        console.error("Fetch or join error:", err);
        setError(err.message);
      }
    };

    fetchGame();
  }, [gameId]);

  if (error) return <div>Error: {error}</div>;
  if (!game || !currentUser) return <div>Loading...</div>;

  const isPlayer1 = game.player1?.id === currentUser.id;
  const myBoard = isPlayer1 ? game.board1 : game.board2;
  const opponentBoard = isPlayer1 ? game.board2 : game.board1;
  const myTurn = (isPlayer1 && game.turn === "player1") || (!isPlayer1 && game.turn === "player2");

  const handleAttack = async (row, col) => {
    if (!myTurn) {
      alert("Not your turn!");
      return;
    }

    try {
      const res = await fetch(`/api/games/${gameId}/attack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ row, col }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Attack failed.");
      }

      const updatedGame = await res.json();
      setGame(updatedGame);
    } catch (err) {
      console.error("Attack error:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Game: {game._id}</h2>
      <p>Status: {game.status}</p>
      <p>Turn: {game.turn}</p>
      <p>Winner: {game.winner || "None yet"}</p>

      <div style={{ display: "flex", gap: "40px" }}>
        <Board
          board={opponentBoard}
          title="Opponent's Board"
          isOwnBoard={false}
          onCellClick={handleAttack}
          disabled={!myTurn || game.status !== "Active"}
        />
        <Board
          board={myBoard}
          title="Your Board"
          isOwnBoard={true}
          disabled={true}
        />
      </div>
    </div>
  );
}

