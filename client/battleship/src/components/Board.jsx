import React from "react";
import "./Board.css";

export default function Board({ board, title, isOwnBoard, onCellClick, disabled }) {
  return (
    <div className="board-wrapper">
      <h3>{title}</h3>
      <div className="board-grid">
        {board.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((cell, colIndex) => {
              let display = "";

              if (cell === "H") display = "💥";
              else if (cell === "M") display = "🌊";
              else if (cell === "S" && isOwnBoard) display = "🚢";

              return (
                <div
                  key={colIndex}
                  className="board-cell"
                  onClick={() =>
                    !disabled && onCellClick && onCellClick(rowIndex, colIndex)
                  }
                >
                  {display}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

