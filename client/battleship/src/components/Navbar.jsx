import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function NavBar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLinkClick = (e, to) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" onClick={(e) => handleLinkClick(e, "/")}>
          Home
        </Link>
        <Link to="/games" onClick={(e) => handleLinkClick(e, "/games")}>
          All Games
        </Link>
        <Link to="/game/new" onClick={(e) => handleLinkClick(e, "/game/new")}>
          New Game
        </Link>
        <Link
          to="/high-scores"
          onClick={(e) => handleLinkClick(e, "/high-scores")}
        >
          High Scores
        </Link>
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <div className="navbar-user">
            <span>{currentUser.username}</span>
            <button onClick={handleLogout}>Sign Out</button>
          </div>
        ) : (
          <>
            <Link to="/login" onClick={(e) => handleLinkClick(e, "/login")}>
              Login
            </Link>
            <Link
              to="/register"
              onClick={(e) => handleLinkClick(e, "/register")}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
