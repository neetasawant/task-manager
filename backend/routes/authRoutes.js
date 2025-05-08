const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddlewares");

//register
router.post("/register", register);

//login
router.post("/login", login);
// Get list of all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/profile", authMiddleware(), async (req, res) => {
  try {
    console.log(req.user.id);
    const user = await User.findById(req.user.id); 
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
