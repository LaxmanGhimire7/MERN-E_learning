import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InstructorAssignmentManager() {
  const { state } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          toast.error(data.msg || "Failed to load courses");
        }
      } catch {
        setError("Failed to load courses");
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, [state.token]);

  useEffect(() => {
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
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courses, state.token]);

  const openEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 16) : "",
      assignToAll: assignment.assignToAll,
      assignTo: assignment.assignTo || [],
    });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;
    setSaving(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      assignToAll: formData.assignToAll,
      assignTo: formData.assignTo,
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
        toast.success("Assignment updated successfully");
        setEditingAssignment(null);
        setLoading(true);
        const assignmentsMap = {};
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
        setLoading(false);
      } else {
        toast.error(data.msg || "Failed to update assignment");
      }
    } catch {
      toast.error("Update request failed");
    } finally {
      setSaving(false);
    }
  };

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
        toast.success("Assignment deleted");
        // Refresh assignments
        setLoading(true);
        const assignmentsMap = {};
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
        setLoading(false);
      } else {
        toast.error(data.msg || "Failed to delete assignment");
      }
    } catch {
      toast.error("Delete request failed");
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500 text-lg select-none">Loading...</p>;
  if (error)
    return (
      <p className="p-6 text-center text-red-600 text-lg font-semibold select-none">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-900 select-none">
        My Courses & Assignments
      </h1>

      {courses.length === 0 && (
        <p className="text-center text-gray-600 select-none">No courses assigned yet.</p>
      )}

      {courses.map((course) => (
        <div
          key={course._id}
          className="mb-10 border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 select-none">{course.name}</h2>

          {assignmentsByCourse[course._id]?.length === 0 && (
            <p className="italic text-gray-500 select-none">No assignments for this course</p>
          )}

          {assignmentsByCourse[course._id]?.map((assignment) => (
            <div
              key={assignment._id}
              className="border rounded-md p-4 mb-4 flex justify-between items-center hover:bg-indigo-50 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-indigo-900">{assignment.title}</h3>
                <p className="text-sm text-gray-600 select-none">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => openEdit(assignment)}
                  className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAssignment(assignment._id)}
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition"
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
          className="fixed inset-0 bg-white flex justify-center items-center z-50"
          onClick={() => setEditingAssignment(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6 text-indigo-900 select-none">Edit Assignment</h2>
            <form onSubmit={submitUpdate} className="space-y-5">
              <div>
                <label className="block font-semibold mb-2 select-none">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 select-none">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 select-none">Due Date *</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 select-none">
                  <input
                    type="checkbox"
                    name="assignToAll"
                    checked={formData.assignToAll}
                    onChange={onChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-400"
                  />
                  <span>Assign to all enrolled students</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-6 py-2 rounded-md border border-gray-400 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-2 rounded-md text-white ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } transition`}
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
