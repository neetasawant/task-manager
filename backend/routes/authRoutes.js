const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
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
  
module.exports = router;
