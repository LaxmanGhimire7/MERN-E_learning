import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

function InstructorAssignmentManager() {
  const { state } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For editing assignment
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignToAll: true,
    assignTo: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch instructor's courses
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/course/instructor-courses", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await res.json();
        if (res.ok && data.response) {
          setCourses(data.response);
        } else {
          setError(data.msg || "Failed to load courses");
        }
      } catch {
        setError("Failed to load courses");
      }
    };

    fetchCourses();
  }, [state.token]);

  useEffect(() => {
    // For each course fetch assignments
    const fetchAssignments = async () => {
      if (courses.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      let assignmentsMap = {};
      try {
        for (const course of courses) {
          const res = await fetch(
            `http://localhost:9000/api/assignment/getAssignmentsForCourse/${course._id}`,
            {
              headers: { Authorization: `Bearer ${state.token}` },
            }
          );
          const data = await res.json();
          if (res.ok && data.assignments) {
            assignmentsMap[course._id] = data.assignments;
          } else {
            assignmentsMap[course._id] = [];
          }
        }
        setAssignmentsByCourse(assignmentsMap);
      } catch {
        setError("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courses, state.token]);

  // Open edit modal with assignment data
  const openEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      dueDate: assignment.dueDate ? assignment.dueDate.slice(0,16) : "",
      assignToAll: assignment.assignToAll,
      assignTo: assignment.assignTo || [],
    });
  };

  // Handle form input change
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit updated assignment
  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;
    setSaving(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      assignToAll: formData.assignToAll,
      assignTo: formData.assignTo, // keep empty array for now; you can extend UI to select students if needed
    };

    try {
      const res = await fetch(
        `http://localhost:9000/api/assignment/updateAssignment/${editingAssignment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Assignment updated successfully");
        // Refresh assignments
        setEditingAssignment(null);
        // Optionally refetch assignments here
        window.location.reload(); // simple quick refresh, or implement better state update
      } else {
        alert(data.msg || "Failed to update assignment");
      }
    } catch {
      alert("Update request failed");
    } finally {
      setSaving(false);
    }
  };

  // Delete assignment with confirmation
  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const res = await fetch(
        `http://localhost:9000/api/assignment/deleteAssignment/${assignmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Assignment deleted");
        // Reload page or update state
        window.location.reload();
      } else {
        alert(data.msg || "Failed to delete assignment");
      }
    } catch {
      alert("Delete request failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Courses & Assignments</h1>

      {courses.length === 0 && (
        <p>No courses assigned yet.</p>
      )}

      {courses.map((course) => (
        <div key={course._id} className="mb-8 border rounded p-4 bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">{course.name}</h2>

          {assignmentsByCourse[course._id]?.length === 0 && (
            <p className="italic text-gray-600">No assignments for this course</p>
          )}

          {assignmentsByCourse[course._id]?.map((assignment) => (
            <div
              key={assignment._id}
              className="border rounded p-3 mb-3 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-sm text-gray-600">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => openEdit(assignment)}
                  className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAssignment(assignment._id)}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Edit modal */}
      {editingAssignment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setEditingAssignment(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">Edit Assignment</h2>
            <form onSubmit={submitUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Due Date *</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={onChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="assignToAll"
                    checked={formData.assignToAll}
                    onChange={onChange}
                    className="form-checkbox"
                  />
                  <span>Assign to all enrolled students</span>
                </label>
              </div>

              {/* Optionally, you can add UI to select specific students when assignToAll is false */}

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 rounded border border-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 rounded text-white ${
                    saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorAssignmentManager;
