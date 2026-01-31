const router = require("express").Router();
const Score = require("../models/score");

router.post("/save", async (req, res) => {
  await new Score(req.body).save();
  res.json({ message: "Saved" });
});

router.get("/leaderboard", async (req, res) => {
  const scores = await Score.find().sort({ wpm: -1 }).limit(10);
  res.json(scores);
});

router.get("/rank/:username", async (req, res) => {
  const scores = await Score.find().sort({ wpm: -1 });
  const rank = scores.findIndex(s => s.username === req.params.username);
  res.json({ rank: rank + 1, total: scores.length });
});

module.exports = router;
