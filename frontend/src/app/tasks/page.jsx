"use client";
import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks/tasks");
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available</p>
      ) : (
        <ul className="space-y-6">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    task.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{task.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Priority:</span>{" "}
                  <span
                    className={`font-semibold ${
                      task.priority === "High"
                        ? "text-red-600"
                        : task.priority === "Medium"
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Assigned to:</span>{" "}
                  {task.assignedTo?.name || <span className="text-red-500">Unassigned</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
