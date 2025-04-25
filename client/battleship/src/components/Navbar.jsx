import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; 
import React from "react";

export default function NavBar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        onLogout(); 
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/games">All Games</Link>
        <Link to="/game/new">New Game</Link>
        <Link to="/high-scores">High Scores</Link>
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <div className="navbar-user">
            <span>{currentUser.username}</span>
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}


