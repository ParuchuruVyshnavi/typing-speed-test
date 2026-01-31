const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  await new User(req.body).save();
  res.json({ message: "Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });

  res.json(user);
});

module.exports = router;
