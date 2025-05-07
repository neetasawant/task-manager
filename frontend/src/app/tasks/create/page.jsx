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
    try {
      const token = localStorage.getItem("token");
      await API.post("/tasks/tasks", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/tasks");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Error creating task");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Title"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="dueDate"
          type="date"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="priority"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          name="status"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          name="assignedTo"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Assign to User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
