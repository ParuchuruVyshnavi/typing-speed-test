const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Score",
  new mongoose.Schema({
    username: String,
    wpm: Number,
    accuracy: Number,
    difficulty: String,
    date: { type: Date, default: Date.now },
  })
);
