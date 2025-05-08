"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import API from "../../../../utils/api";

export default function TaskEditPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { taskId } = params;

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log(taskId);
        const [taskRes, usersRes] = await Promise.all([
          API.get(`/tasks/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/auth/users"),
        ]);

        setForm({
          title: taskRes.data.title,
          description: taskRes.data.description,
          dueDate: taskRes.data.dueDate?.slice(0, 10) || "",
          priority: taskRes.data.priority,
          status: taskRes.data.status,
          assignedTo: taskRes.data.assignedTo?._id || "",
        });
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load task data.");
      }
    };

    if (taskId) fetchData();
  }, [taskId]);

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
      await API.put(`/tasks/tasks/${taskId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Error updating task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form.title && !error)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white border border-gray-300 rounded-lg shadow-md p-10">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
        Edit Task
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
            value={form.title}
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
            value={form.description}
            onChange={handleChange}
            rows="4"
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
            value={form.dueDate?.substring(0, 10)} // trim timestamp
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
              value={form.priority}
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
              value={form.status}
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
            value={form.assignedTo}
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
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-semibold py-2.5 rounded-md shadow-sm transition-colors duration-200 ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
}
