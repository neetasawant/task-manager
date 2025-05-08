"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskFilters from "../tasks/TaskFilters";
import API from "../../utils/api";
import NotificationBar from "../../components/NotificationBar";

const TaskCard = ({ task, handleViewTask, handleEditTask, handleDeleteTask, isAdmin,}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
  
    const shortenedDescription = task.description.slice(0, 100); // Show first 100 characters
  
    const priorityColor = task.priority === "High"
      ? "bg-red-100 border-red-600 text-red-600"
      : task.priority === "Medium"
      ? "bg-yellow-100 border-yellow-600 text-yellow-600"
      : "bg-green-100 border-green-600 text-green-600";
  
    return (
      <div className={`rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 w-full ${priorityColor}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{task.title}</h3>
              <p className="text-sm text-gray-600">
                {isExpanded ? task.description : shortenedDescription}
                {task.description.length > 100 && (
                  <button
                    onClick={toggleExpand}
                    className="text-indigo-600 font-medium ml-1"
                  >
                    {isExpanded ? "Show Less" : "...Show More"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700 mt-6">
          <div>
            <span className="font-semibold">Due Date:</span>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Priority:</span>{" "}
            <span
              className={`${
                task.priority === "High"
                  ? "text-red-600"
                  : task.priority === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              } font-medium`}
            >
              {task.priority}
            </span>
          </div>
          <div>
            <span className="font-semibold">Status:</span> {task.status}
          </div>
          {task.assignedTo && (
            <div className="col-span-2">
              <span className="font-semibold">Assigned To:</span>{" "}
              {task.assignedTo.name}
            </div>
          )}
        </div>
  
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-500">
          <button
            onClick={() => handleViewTask(task)}
            className="text-indigo-600 border border-indigo-600 hover:bg-indigo-50 text-sm px-4 py-1.5 rounded-full transition"
          >
            View
          </button>
          <button
            onClick={() => handleEditTask(task._id)}
            className="text-blue-600 border border-blue-600 hover:bg-blue-50 text-sm px-4 py-1.5 rounded-full transition"
          >
            Edit
          </button>
          {isAdmin && (
          <button
            onClick={() => handleDeleteTask(task._id)}
            className="text-red-600 border border-red-600 hover:bg-red-50 text-sm px-4 py-1.5 rounded-full transition"
          >
            Delete
          </button>
          )}
        </div>
      </div>
    );
  };
  

export default function DashboardPage() {
  const [data, setData] = useState({
    createdTasks: [],
    assignedTasks: [],
    overdueTasks: [],
  });
  const [filter, setFilter] = useState({
    priority: "",
    status: "",
    dueDate: "",
  });
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      fetchDashboard();
      fetchUserProfile();
    }
    setLoading(false);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/tasks/dashboard");
      
      // Sorting the tasks based on dueDate in ascending order
      const sortedCreatedTasks = res.data.createdTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      const sortedAssignedTasks = res.data.assignedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      const sortedOverdueTasks = res.data.overdueTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
      setData({
        createdTasks: sortedCreatedTasks,
        assignedTasks: sortedAssignedTasks,
        overdueTasks: sortedOverdueTasks,
      });
    } catch (err) {
      setError("Failed to fetch dashboard data.");
      console.error("Dashboard error", err);
    }
  };
  

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error("Profile error", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setProfile(null);
    setData({ createdTasks: [], assignedTasks: [], overdueTasks: [] });
    router.push("/login");
  };

  const handleCreateTask = () => {
    router.push("/tasks/create");
  };

  const handleEditTask = (taskId) => {
    router.push(`/tasks/edit/${taskId}`);
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        await API.delete(`/tasks/tasks/${taskId}`);
        fetchDashboard();
      } catch (err) {
        setError("Failed to delete task.");
        console.error("Delete error", err);
      }
    }
  };

  const Section = ({ title, tasks }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              handleViewTask={handleViewTask}
              isAdmin={profile?.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">You are not logged in</h1>
          <p className="text-lg mb-4">Please log in to access your dashboard</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  const filterTasks = (tasks) => {
  return tasks.filter((task) => {
    const matchesPriority =
      !filter.priority || task.priority === filter.priority;
    const matchesStatus =
      !filter.status || task.status === filter.status;
    const matchesDueDate =
      !filter.dueDate ||
      new Date(task.dueDate).toLocaleDateString() ===
        new Date(filter.dueDate).toLocaleDateString();

    const search = filter.search?.toLowerCase() || "";

    const matchesSearch =
      !search ||
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search);

    return (
      matchesPriority &&
      matchesStatus &&
      matchesDueDate &&
      matchesSearch
    );
  });
};


  // Filtered tasks
  const filteredCreatedTasks = filterTasks(data.createdTasks);
  const filteredAssignedTasks = filterTasks(data.assignedTasks);
  const filteredOverdueTasks = filterTasks(data.overdueTasks);
  return (
    <>
    <NotificationBar/>
    <div className="max-w mx-auto px-6 py-10 bg-gray-50">
      {showModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="mb-2 text-gray-700">{selectedTask.description}</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedTask.status}</p>
              <p>
                <strong>Priority:</strong>{" "}
                <span className={`${
                  selectedTask.priority === "High"
                    ? "text-red-600"
                    : selectedTask.priority === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}>
                  {selectedTask.priority}
                </span>
              </p>
              {selectedTask.assignedTo && (
                <p><strong>Assigned To:</strong> {selectedTask.assignedTo.name}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      {profile && (
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600 flex flex-col md:flex-row items-center md:items-start justify-between mb-10">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome, {profile.name}!
            </h2>
            <p className="text-sm text-gray-600">Email: {profile.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg mt-4 md:mt-0 transition duration-200"
          >
            Logout
          </button>
        </div>
      )}

      {/* Create Task Button */}
      <div className="flex justify-end mb-6">
      {profile?.role !== 'user' || profile?.role !== '' && <button
          onClick={handleCreateTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-200"
        >
          + Create Task
        </button>}
      </div>

      {/* Dashboard Heading */}
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        Task Dashboard
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white text-center p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}
 <TaskFilters filter={filter} onFilter={setFilter} />
      {/* Task Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <Section title="Tasks Created by You" tasks={filteredCreatedTasks} />
        </div>
        <div>
          <Section title="Tasks Assigned to You" tasks={filteredAssignedTasks} />
        </div>
        <div>
          <Section title="Overdue Tasks" tasks={filteredOverdueTasks} />
        </div>
      </div>
    </div>
    </>
  );
}
