import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NewGame() {
  const [gameId, setGameId] = useState(null);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const createGame = async () => {
      try {
        const res = await fetch("/api/games/new", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());

        const g = await res.json();
        setGameId(g._id);
        // status === "Open"
        setGame(g);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    createGame();
  }, []);

  useEffect(() => {
    if (!gameId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const g = await res.json();
        setGame(g);

        // another player joined – jump into the game
        if (g.status === "Active") {
          clearInterval(pollRef.current);
          navigate(`/game/${gameId}`);
        }
      } catch (err) {
        console.error("Waiting-room poll error:", err);
      }
    }, 2500); // 2.5 s

    return () => clearInterval(pollRef.current);
  }, [gameId, navigate]);

  if (error) return <div>Error: {error}</div>;
  if (!gameId) return <div>Creating your game…</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Your room is ready!</h2>
      <p>
        <strong>Game&nbsp;ID:</strong> {gameId}
      </p>

      {game?.status === "Open" && (
        <>
          <p>
            Waiting for an opponent to join…
            <br />
            Share this link:
          </p>
          <code>
            {window.location.origin}/game/{gameId}
          </code>
        </>
      )}
    </div>
  );
}
