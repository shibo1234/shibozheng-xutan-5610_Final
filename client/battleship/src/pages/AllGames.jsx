import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllGames.css";

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

        const gRes = await fetch("/api/games", { credentials: "include" });
        if (!gRes.ok) throw new Error("Failed to fetch games");
        setGames(await gRes.json());
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

  const renderCard = (game) => (
    <div className="game-card" key={game._id}>
      <p>
        <strong>Game ID:</strong> {game._id}
      </p>
      <p className="status">
        <strong>Status:</strong> {game.status}
        {game.status === "Completed" && game.winner && (
          <span className="winner">— Winner: {game.winner}</span>
        )}
      </p>
      <p>
        <strong>Player 1:</strong> {game.player1?.username || "TBD"}
      </p>
      <p>
        <strong>Player 2:</strong> {game.player2?.username || "TBD"}
      </p>
      {game.status === "Open" &&
        !game.player2 &&
        (currentUser && currentUser.id === game.player1?.id ? (
          <span className="waiting-text">
            You cannot join the room you created. Waiting for an opponent…
          </span>
        ) : (
          <button
            className="button button-join"
            onClick={() => handleJoin(game)}
          >
            Join
          </button>
        ))}
      {game.status === "Active" &&
        currentUser &&
        (currentUser.id === game.player1?.id ||
          currentUser.id === game.player2?.id) && (
          <button
            className="button button-resume"
            onClick={() => handleJoin(game)}
          >
            Resume
          </button>
        )}
    </div>
  );

  const cat = {
    openGames: [],
    myOpenGames: [],
    myActiveGames: [],
    myCompletedGames: [],
    otherGames: [],
    guestActive: [],
    guestCompleted: [],
  };

  for (const g of games) {
    const isOpen = g.status === "Open";
    const isActive = g.status === "Active";
    const isCompleted = g.status === "Completed";
    const isP1 = currentUser?.id === g.player1?.id;
    const isP2 = currentUser?.id === g.player2?.id;
    const isMine = isP1 || isP2;

    if (currentUser) {
      if (isOpen && !isMine) cat.openGames.push(g);
      else if (isOpen && isMine) cat.myOpenGames.push(g);
      else if (isActive && isMine) cat.myActiveGames.push(g);
      else if (isCompleted && isMine) cat.myCompletedGames.push(g);
      else cat.otherGames.push(g);
    } else {
      if (isActive) cat.guestActive.push(g);
      if (isCompleted) cat.guestCompleted.push(g);
    }
  }

  const Section = ({ title, list }) =>
    list.length > 0 && (
      <section className="allgames-section">
        <h3>{title}</h3>
        {list.map(renderCard)}
      </section>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="allgames-container">
      <h2>All Games</h2>
      {currentUser ? (
        <>
          <Section title="Open Games" list={cat.openGames} />
          <Section title="My Open Games" list={cat.myOpenGames} />
          <Section title="My Active Games" list={cat.myActiveGames} />
          <Section title="My Completed Games" list={cat.myCompletedGames} />
          <Section title="Other Players' Games" list={cat.otherGames} />
        </>
      ) : (
        <>
          <Section title="Active Games" list={cat.guestActive} />
          <Section title="Completed Games" list={cat.guestCompleted} />
        </>
      )}
    </div>
  );
}
