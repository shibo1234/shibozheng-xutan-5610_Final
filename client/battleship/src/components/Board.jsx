// import React from "react";
// import "./Board.css";

// export default function Board({ board, onCellClick, disabled }) {
//   return (
//     <div className="board">
//       {board.map((row, rowIndex) => (
//         <div className="board-row" key={rowIndex}>
//           {row.map((cell, colIndex) => {
//             let className = "cell";
//             if (cell === "S") className += " ship";
//             if (cell === "H") className += " hit";
//             if (cell === "M") className += " miss";

//             return (
//               <div
//                 key={colIndex}
//                 className={className}
//                 onClick={() =>
//                   !disabled && onCellClick && onCellClick(rowIndex, colIndex)
//                 }
//               />
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// }

import React from "react";
import "./Board.css";

export default function Board({ board, title }) {
  return (
    <div style={{ margin: "20px" }}>
      <h3>{title}</h3>
      <div className="board-grid">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="board-cell">
              {cell === "H" ? "💥" : cell === "M" ? "🌊" : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
