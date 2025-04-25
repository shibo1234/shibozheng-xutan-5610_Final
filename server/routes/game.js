const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const { isAuthenticated } = require("../middleware/auth");

const GRID_SIZE = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2];

function generateBoard() {
  const board = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(null)
  );

  for (const size of SHIP_SIZES) {
    let placed = false;

    while (!placed) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const horizontal = Math.random() < 0.5;

      let fits = true;
      for (let i = 0; i < size; i++) {
        const row = horizontal ? r : r + i;
        const col = horizontal ? c + i : c;

        if (
          row >= GRID_SIZE ||
          col >= GRID_SIZE ||
          board[row][col] !== null
        ) {
          fits = false;
          break;
        }
      }

      if (!fits) continue;

      for (let i = 0; i < size; i++) {
        const row = horizontal ? r : r + i;
        const col = horizontal ? c + i : c;
        board[row][col] = "S";
      }

      placed = true;
    }
  }

  return board;
}

router.post("/new", isAuthenticated, async (req, res) => {
    try {
      const user = req.session.user;
  
      const newGame = new Game({
        player1: { id: user.id, username: user.username },
        board1: generateBoard(),
        board2: null,
        status: "Open",
        turn: "player1",
      });
  
      await newGame.save();
      res.status(201).json(newGame);
    } catch (err) {
      console.error("Failed to create game:", err);
      res.status(500).send("Could not create game.");
    }
});

router.get("/:gameId", isAuthenticated, async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).send("Game not found.");
    res.json(game);
  } catch (err) {
    console.error("Fetch game failed:", err);
    res.status(500).send("Could not fetch game.");
  }
});

router.post("/:gameId/join", isAuthenticated, async (req, res) => {
  try {
    const { gameId } = req.params;
    const user = req.session.user;

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).send("Game not found.");
    if (game.status !== "Open") return res.status(400).send("Game is not open.");
    if (game.player1.id === user.id) return res.status(400).send("You can't join your own game.");

    game.player2 = { id: user.id, username: user.username };
    game.board2 = generateBoard();
    game.status = "Active";
    game.turn = "player1";

    console.log("Before Save:");
    console.log({
      player1: game.player1,
      player2: game.player2,
      status: game.status,
      turn: game.turn,
    });

    await game.save();

    console.log("After Save:");
    console.log({
      player1: game.player1,
      player2: game.player2,
      status: game.status,
      turn: game.turn,
    });
    res.json(game);
  } catch (err) {
    console.error("Join game error:", err);
    res.status(500).send("Failed to join game.");
  }
});

router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error("Fetch games error:", err);
    res.status(500).send("Failed to fetch games.");
  }
},);

module.exports = router;

  
  