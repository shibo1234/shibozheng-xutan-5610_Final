import React from "react";
import { Link } from "react-router-dom";
import { FaGamepad, FaBook, FaTrophy } from "react-icons/fa";
import myImage from "../images/NPIXTXSIUNHV3ACRPMPSP6TKGM.png.avif";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h2 className="home-title">🚢 Battleship Game</h2>
        <p className="home-subtitle">Let's Play!!!</p>
        <div className="button-container">
          <Link to="/games">
            <button className="btn btn-game">
              <FaGamepad /> All Games
            </button>
          </Link>
          <Link to="/game/new">
            <button className="btn btn-create">
              <FaGamepad /> Create New Game
            </button>
          </Link>
          <Link to="/rules">
            <button className="btn btn-rules">
              <FaBook /> Rules
            </button>
          </Link>
          <Link to="/high-scores">
            <button className="btn btn-scores">
              <FaTrophy /> High Scores
            </button>
          </Link>
        </div>
        <div className="image-wrapper">
          <img
            src={myImage}
            alt="Battleship Illustration"
            className="home-image"
          />
        </div>
      </div>
    </div>
  );
}
