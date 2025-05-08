const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/authMiddlewares");

// Routes for task management
router.post("/tasks", auth(), taskController.createTask); 
router.get("/tasks", auth(), taskController.getAllTasks); 
router.put("/tasks/:taskId", auth(), taskController.updateTask); 
router.delete("/tasks/:taskId", auth('Admin'), taskController.deleteTask); 
router.get("/tasks/:taskId", auth(), taskController.getTaskById); 
router.get("/dashboard", auth(), taskController.getDashboardData); 

module.exports = router;
