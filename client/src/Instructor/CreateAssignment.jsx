// src/components/instructor/CreateAssignment.jsx
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

function CreateAssignment() {
  const { state } = useContext(AuthContext);
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedCourses, setAssignedCourses] = useState([]);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9000/api/assignment/createAssignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          course: courseId,
          title,
          description,
          dueDate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Assignment created successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");
      } else {
        toast.error(data.msg || "Failed to create assignment.");
      }
    } catch (err) {
      toast.error("Server error. Try again.");
    }
  };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
          📚 Create Assignment
        </h2>

        <form onSubmit={handleCreate} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Assignment Title</label>
            <input
              type="text"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Write a brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
          >
            ➕ Create Assignment
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAssignment;
