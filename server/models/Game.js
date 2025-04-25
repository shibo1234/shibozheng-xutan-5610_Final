const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
  {
    player1: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      username: String,
    },
    player2: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
    board1: {
      type: [[String]], 
      required: true,
    },
    board2: {
        type: [[String]],
        default: null,
    },
    turn: {
      type: String,
      default: "player1",
    },
    status: {
      type: String,
      enum: ["Open", "Active", "Completed"],
      default: "Open",
    },
    winner: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", GameSchema);
