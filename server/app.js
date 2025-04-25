const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

const app = express();
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
    .catch((err) => console.error(" MongoDB connection error:", err));
  
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use("/api", authRoutes);
app.use("/api/games", gameRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/api/test", (req, res) => {
    res.send("Backend is working!");
});


  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
