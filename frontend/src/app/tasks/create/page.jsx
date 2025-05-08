"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/api";
import { useRouter } from "next/navigation";

export default function TaskCreatePage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending",
    assignedTo: "",
  });
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and Description are required.");
      setIsSubmitting(false);
      return;
    }

    if (!form.dueDate) {
      setError("Please select a due date.");
      setIsSubmitting(false);
      return;
    }

    const due = new Date(form.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (due < today) {
      setError("Due date cannot be in the past.");
      setIsSubmitting(false);
      return;
    }

    if (!form.assignedTo) {
      setError("Please assign the task to a user.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await API.post("/tasks/tasks", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Create Task Error:", err);
      setError(err.response?.data?.msg || "Error creating task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white border border-gray-300 rounded-lg shadow-md p-10">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
        Create a New Task
      </h2>

      {error && (
        <div className="mb-6 text-center text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="Enter task title"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Brief description of the task"
            rows="4"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Assign To
          </label>
          <select
            name="assignedTo"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Select a User --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-full text-white font-semibold py-2.5 rounded-md shadow-sm transition-colors duration-200
    ${
      isSubmitting
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
        >
          {isSubmitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
