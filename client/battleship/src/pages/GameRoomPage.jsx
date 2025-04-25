import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Board from "../components/Board";

export default function GamePage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const pollRef = useRef(null);
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

  const fetchLatestGame = async () => {
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        credentials: "include",
      });
      if (res.ok) setGame(await res.json());
    } catch (e) {
      console.error("Polling error:", e);
    }
  };

  // Calculate these values before the next useEffect
  const isPlayer1 =
    currentUser && game ? game?.player1?.id === currentUser?.id : false;
  const myBoard = isPlayer1 ? game?.board1 : game?.board2;
  const opponentBoard = isPlayer1 ? game?.board2 : game?.board1;
  const myTurn = game
    ? (isPlayer1 && game.turn === "player1") ||
      (!isPlayer1 && game.turn === "player2")
    : false;

  useEffect(() => {
    if (!game || game.status !== "Active") {
      clearInterval(pollRef.current);
      pollRef.current = null;
      return;
    }

    // We poll ONLY while waiting for opponent's move
    if (!myTurn && !pollRef.current) {
      pollRef.current = setInterval(fetchLatestGame, 2500); // 2.5 s
    }

    // Stop polling once it becomes my turn
    if (myTurn && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [game, myTurn]);

  // Only have these conditions once, after all hooks
  if (error) return <div>Error: {error}</div>;
  if (!game || !currentUser) return <div>Loading...</div>;

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

      if (updatedGame.status === "Active") {
        fetchLatestGame();
      }

      if (updatedGame.status === "Completed") {
        alert(`${updatedGame.winner} wins!`);
      }
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
        {opponentBoard && Array.isArray(opponentBoard) && (
          <Board
            board={opponentBoard}
            title="Opponent's Board"
            isOwnBoard={false}
            onCellClick={handleAttack}
            disabled={!myTurn || game.status !== "Active"}
          />
        )}
        {myBoard && Array.isArray(myBoard) && (
          <Board
            board={myBoard}
            title="Your Board"
            isOwnBoard={true}
            disabled={true}
          />
        )}
      </div>
    </div>
  );
}
