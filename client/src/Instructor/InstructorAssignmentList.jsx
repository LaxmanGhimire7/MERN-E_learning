import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { format } from "date-fns";

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
        alert(data.msg || "Failed to load assignments");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (assignment) => {
    setSelectedAssignment(assignment);
    setForm({
      title: assignment.title,
      description: assignment.description,
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
        alert("Assignment deleted");
        fetchAssignments();
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
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
        alert("Assignment updated");
        setShowModal(false);
        fetchAssignments();
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const filteredAssignments = courseFilter === "All"
    ? assignments
    : assignments.filter(a => a.courseId.name === courseFilter);

  const uniqueCourses = ["All", ...new Set(assignments.map(a => a.courseId.name))];

  if (loading) return <p>Loading assignments...</p>;
  if (assignments.length === 0) return <p>No assignments found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Assignments</h2>

      <label className="block mb-4">
        Filter by Course:
        <select
          className="ml-2 p-1 rounded border"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {uniqueCourses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </label>

      <ul className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const isPastDue = new Date(assignment.dueDate) < new Date();
          return (
            <li key={assignment._id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to={`/instructor-dashboard/instructorSubmissions/${assignment._id}`}
                    className="text-blue-600 font-semibold text-lg"
                  >
                    {assignment.title}
                  </Link>
                  <p className="text-sm text-gray-600">Due: {format(new Date(assignment.dueDate), 'PPP')}</p>
                  <p className="text-sm">Course: {assignment.courseId.name}</p>
                  {isPastDue && <p className="text-red-600 font-semibold">Submission closed</p>}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClick(assignment)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white"
                    disabled={isPastDue}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-bold mb-4">Edit Assignment</h3>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
              placeholder="Description"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-400 text-white rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-3 py-1 bg-blue-500 text-white rounded">
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
