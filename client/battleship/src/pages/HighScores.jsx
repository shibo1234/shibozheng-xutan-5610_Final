import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HighScores.css";

export default function HighScoresPage() {
  const [scores, setScores] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch("/api/me", { credentials: "include" });
        if (meRes.ok) setCurrentUser(await meRes.json());

        const rankRes = await fetch("/api/gamesRank/rank", {
          credentials: "include",
        });
        if (!rankRes.ok) throw new Error("Failed to fetch scores");

        const data = await rankRes.json();
        data.sort((a, b) => {
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (a.losses !== b.losses) return a.losses - b.losses;
          return a.username.localeCompare(b.username);
        });
        setScores(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    })();
  }, []);

  if (error) return <div style={{ padding: 20 }}>Error: {error}</div>;
  if (!scores.length) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div className="scores-container">
      <main className="scores-content">
        <h2>Top Players</h2>

        <table className="scores-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Wins</th>
              <th>Losses</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((p, idx) => {
              const isMe = currentUser && p.username === currentUser.username;
              return (
                <tr key={p.username} className={isMe ? "highlight" : ""}>
                  <td>{idx + 1}</td>
                  <td>{isMe ? <strong>{p.username}</strong> : p.username}</td>
                  <td>{p.wins}</td>
                  <td>{p.losses}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Link to="/" className="btn-return">
          Back to Home
        </Link>
      </main>
    </div>
  );
}
