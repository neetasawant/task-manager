"use client";

import { useState } from "react";

export default function TaskFilters({ onFilter }) {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    dueDate: "", // 👈 Add dueDate to state
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6">
      {/* Status Filter */}
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {/* Due Date Filter */}
      <input
        type="date"
        name="dueDate"
        value={filters.dueDate}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md"
      />

      {/* Search Input */}
      <input
        type="text"
        name="search"
        placeholder="Search by title/description"
        value={filters.search}
        onChange={handleChange}
        className="border px-3 py-2 rounded-md flex-grow"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Filter
      </button>
    </form>
  );
}
