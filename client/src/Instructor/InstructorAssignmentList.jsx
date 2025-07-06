import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InstructorAssignmentList() {
  const { state } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [courseFilter, setCourseFilter] = useState("All");

  useEffect(() => {
    fetchAssignments();
  }, [state.token]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/assignmentSubmission/instructor", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAssignments(data.assignments || []);
      } else {
        toast.error(data.msg || "Failed to load assignments");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (assignment) => {
    setSelectedAssignment(assignment);
    setForm({
      title: assignment.title,
      description: assignment.description || "",
      dueDate: assignment.dueDate.split("T")[0],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(`http://localhost:9000/api/assignment/deleteAssignment/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Assignment deleted");
        fetchAssignments();
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete assignment");
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("dueDate", form.dueDate);

    try {
      const res = await fetch(
        `http://localhost:9000/api/assignment/updateAssignment/${selectedAssignment._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${state.token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Assignment updated");
        setShowModal(false);
        fetchAssignments();
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update assignment");
    }
  };

  const filteredAssignments =
    courseFilter === "All"
      ? assignments
      : assignments.filter((a) => a.courseId.name === courseFilter);

  const uniqueCourses = ["All", ...new Set(assignments.map((a) => a.courseId.name))];

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500 text-lg select-none">Loading assignments...</p>
    );
  if (assignments.length === 0)
    return (
      <p className="p-6 text-center text-gray-600 select-none">No assignments found.</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900 select-none">
        Your Assignments
      </h2>

      <label className="block mb-6 text-gray-700 font-semibold select-none">
        Filter by Course:
        <select
          className="ml-3 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {uniqueCourses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </label>

      <ul className="space-y-5">
        {filteredAssignments.map((assignment) => {
          const isPastDue = new Date(assignment.dueDate) < new Date();
          return (
            <li
              key={assignment._id}
              className="border rounded-lg p-5 shadow hover:shadow-lg transition cursor-pointer bg-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to={`/instructor-dashboard/instructorSubmissions/${assignment._id}`}
                    className="text-indigo-700 font-semibold text-xl hover:underline"
                  >
                    {assignment.title}
                  </Link>
                  <p className="text-sm text-gray-600 select-none">
                    Due: {format(new Date(assignment.dueDate), "PPP")}
                  </p>
                  <p className="text-sm select-none">Course: {assignment.courseId.name}</p>
                  {isPastDue && (
                    <p className="text-red-600 font-semibold select-none">Submission closed</p>
                  )}
                </div>
                <div className="space-x-3 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(assignment)}
                    className={`px-4 py-2 rounded-md text-white transition ${
                      isPastDue
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
                    disabled={isPastDue}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-indigo-900 select-none">Edit Assignment</h3>

            <label className="block mb-2 font-semibold select-none">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Title"
            />

            <label className="block mb-2 font-semibold select-none">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mb-4 p-2 border rounded resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Description"
            />

            <label className="block mb-2 font-semibold select-none">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorAssignmentList;
