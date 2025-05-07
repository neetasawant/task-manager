const Task = require("../models/Task");
const User = require("../models/User"); // Import User model for task assignment

// Create a new task
exports.createTask = async (req, res) => {
    try {
      const { title, description, dueDate, priority, status, assignedTo } = req.body;
  
      // Validate assigned user exists
      if (assignedTo) {
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
          return res.status(400).json({ msg: "Assigned user does not exist" });
        }
      }
  
      const newTask = new Task({
        title,
        description,
        dueDate,
        priority,
        status,
        createdBy: req.user._id, // Assuming auth middleware sets this
        assignedTo: assignedTo || null,
      });
  
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email"); 
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};
