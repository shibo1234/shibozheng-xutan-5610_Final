import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/games", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch games");

        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error("Fetch games error:", err);
        setError(err.message);
      }
    };

    fetchGames();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>All Games</h2>
      {games.map((game) => (
        <div key={game._id} style={{ marginBottom: "15px", border: "1px solid #ccc", padding: "10px" }}>
          <p><strong>Game ID:</strong> {game._id}</p>
          <p><strong>Status:</strong> {game.status}</p>
          <p><strong>Player 1:</strong> {game.player1?.username || "TBD"}</p>
          <p><strong>Player 2:</strong> {game.player2?.username || "TBD"}</p>

          {/* <Link to={`/game/${game._id}`}>
            <button>Go to Game</button>
          </Link> */}

          {game.status === "Open" && !game.player2 && (
            <Link to={`/game/${game._id}`}>
              <button style={{ marginLeft: "10px" }}>Join</button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
