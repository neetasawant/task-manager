const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/authMiddlewares");
// Routes for task management
router.post("/tasks", auth, taskController.createTask);
router.get("/tasks", taskController.getAllTasks);
router.put("/tasks/:taskId", taskController.updateTask);
router.delete("/tasks/:taskId", taskController.deleteTask);

module.exports = router;
