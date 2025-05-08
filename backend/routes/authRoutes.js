const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { register, login } = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddlewares')
router.post("/register", register);
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
    console.log(req.user.id)
    const user = await User.findById(req.user.id); // Assuming the user ID is stored in the token
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      // Add other profile fields as necessary
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
