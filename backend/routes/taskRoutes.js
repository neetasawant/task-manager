const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/authMiddlewares");

// Routes for task management
router.post("/tasks", auth(), taskController.createTask); // All authenticated users can create tasks
router.get("/tasks", auth(), taskController.getAllTasks); // All authenticated users can view tasks
router.put("/tasks/:taskId", auth(), taskController.updateTask); // All authenticated users can update tasks
router.delete("/tasks/:taskId", auth('Admin'), taskController.deleteTask); // Only Admin can delete tasks
router.get("/tasks/:taskId", auth(), taskController.getTaskById); // All authenticated users can view task details
router.get("/dashboard", auth(), taskController.getDashboardData); // All authenticated users can view the dashboard

module.exports = router;
