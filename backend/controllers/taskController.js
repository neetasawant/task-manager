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
        createdBy: req.user.id, // Assuming auth middleware sets this
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
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};


// Update task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;
console.log(taskId,'task id')
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

// Get a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();

    // Tasks created by the logged-in user
    const createdTasks = await Task.find({ createdBy: userId })
      .populate({ path: "assignedTo", select: "name email" })
      .populate({ path: "createdBy", select: "name email" });

    // Tasks assigned to the logged-in user
    const assignedTasks = await Task.find({ assignedTo: userId })
      .populate({ path: "assignedTo", select: "name email" })
      .populate({ path: "createdBy", select: "name email" });

    // Overdue tasks (assigned to current user OR all, based on requirement)
    const overdueTasks = await Task.find({
      dueDate: { $lt: today },
      status: { $ne: "Completed" },
      assignedTo: userId, // You can remove this line if you want all overdue tasks
    })
      .populate({ path: "assignedTo", select: "name email" })
      .populate({ path: "createdBy", select: "name email" });

    res.status(200).json({ createdTasks, assignedTasks, overdueTasks });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard fetch failed", error: err.message });
  }
};

