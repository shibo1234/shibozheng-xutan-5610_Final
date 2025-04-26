import React from "react";
import { useNavigate } from "react-router-dom";
import "./rules.css";

export default function Rules() {
  const navigate = useNavigate();

  return (
    <main className="rules-main-container">
      <h2>Game Rules</h2>
      <ol>
        <li>
          <strong>Objective:</strong> Sink all of your opponent's ships before
          they sink yours.
        </li>
        <li>
          <strong>Setup:</strong> Each player places their fleet on a 10×10
          grid, ships non-overlapping and placed horizontally or vertically.
        </li>
        <li>
          <strong>Fleet Composition:</strong>
          <table className="type-table">
            <thead>
              <tr>
                <th>Carrier</th>
                <th>Battleship</th>
                <th>Cruiser</th>
                <th>Destroyers</th>
                <th>Submarines</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5 spaces</td>
                <td>4 spaces</td>
                <td>3 spaces</td>
                <td>3 spaces each (×2)</td>
                <td>2 spaces each (×2)</td>
              </tr>
            </tbody>
          </table>
        </li>
        <li>
          <strong>Gameplay:</strong>
          <ul>
            <li>Players alternate calling coordinates (e.g., B4, C7).</li>
            <li>Hit = “Hit!”, miss = “Miss.”</li>
            <li>When all squares of a ship are hit, it’s “Sunk.”</li>
          </ul>
        </li>
        <li>
          <strong>Winning:</strong> First to sink all opponent’s ships wins.
        </li>
      </ol>

      <div className="play-game-container">
        <button className="play-btn" onClick={() => navigate("/games")}>
          Let's find a game to play!
        </button>
      </div>

      <section id="credits">
        <h3>Made By</h3>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:fake.email@example.com">fake.email@example.com</a>
          </li>
          <li>
            GitHub:{" "}
            <a
              href="https://github.com/fakeuser"
              target="_blank"
              rel="noreferrer"
            >
              github.com/fakeuser
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a
              href="https://linkedin.com/in/fakeuser"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/fakeuser
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
