import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch("/api/me", { credentials: "include" });
        if (meRes.ok) setCurrentUser(await meRes.json());

        const gamesRes = await fetch("/api/games", { credentials: "include" });
        if (!gamesRes.ok) throw new Error("Failed to fetch games");
        setGames(await gamesRes.json());
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    })();
  }, []);

  const handleJoin = async (game) => {
    if (!currentUser) return navigate("/login");

    if (
      game.status === "Active" &&
      (currentUser.id === game.player1?.id ||
        currentUser.id === game.player2?.id)
    ) {
      return navigate(`/game/${game._id}`);
    }

    if (currentUser.id === game.player1?.id) {
      alert("You created this game. Copy the link and send it to a friend!");
      return;
    }

    try {
      const res = await fetch(`/api/games/${game._id}/join`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      navigate(`/game/${game._id}`);
    } catch (err) {
      alert(err.message || "Failed to join game");
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>All Games</h2>

      {games.map((game) => (
        <div
          key={game._id}
          style={{ marginBottom: 15, border: "1px solid #ccc", padding: 10 }}
        >
          <p>
            <strong>Game ID:</strong> {game._id}
          </p>
          <p>
            <strong>Status:</strong> {game.status}
            {game.status === "Completed" && game.winner && (
              <>
                {" "}
                — <em>Winner: {game.winner}</em>
              </>
            )}
          </p>

          <p>
            <strong>Player 1:</strong> {game.player1?.username || "TBD"}
          </p>
          <p>
            <strong>Player 2:</strong> {game.player2?.username || "TBD"}
          </p>

          {game.status === "Open" && !game.player2 && (
            <>
              {currentUser && currentUser.id === game.player1?.id ? (
                <span style={{ marginLeft: 10, fontStyle: "italic" }}>
                  You cannot join the room yuo created. Waiting for an opponent…
                </span>
              ) : (
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => handleJoin(game)}
                >
                  Join
                </button>
              )}
            </>
          )}

          {game.status === "Active" &&
            currentUser &&
            (currentUser.id === game.player1?.id ||
              currentUser.id === game.player2?.id) && (
              <button
                style={{ marginLeft: 10 }}
                onClick={() => handleJoin(game)}
              >
                Resume
              </button>
            )}
        </div>
      ))}
    </div>
  );
}
