import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaCalendarAlt,
  FaBook,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

function InstructorAssignmentList() {
  const { state } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [state.token]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:9000/api/assignmentSubmission/instructor", {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      const data = await res.json();
      if (res.ok) setAssignments(data.assignments || []);
      else toast.error(data.msg || "Failed to load assignments");
    } catch (err) {
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
        toast.success("Assignment deleted successfully");
        fetchAssignments();
      } else toast.error(data.msg);
    } catch (err) {
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
        toast.success("Assignment updated successfully");
        setShowModal(false);
        fetchAssignments();
      } else toast.error(data.msg);
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const filteredAssignments = assignments
    .filter((a) => a.courseId && a.courseId.name) // filter out broken data
    .filter((a) => {
      const courseMatch = courseFilter === "All" || a.courseId?.name === courseFilter;
      const now = new Date();
      let statusMatch = true;
      if (statusFilter === "Active") {
        statusMatch = new Date(a.dueDate) > now;
      } else if (statusFilter === "Finished") {
        statusMatch = new Date(a.dueDate) <= now;
      }
      return courseMatch && statusMatch;
    });

  const uniqueCourses = [
    "All",
    ...new Set(assignments.map((a) => a.courseId?.name).filter(Boolean)),
  ];

  const toggleAssignment = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-24 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Management</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and track assignments for your courses
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mb-8 justify-center">
          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 border-l-4 border-indigo-500 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaBook className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Assignments</p>
              <p className="text-2xl font-bold">{assignments.length}</p>
            </div>
          </div>
          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 border-l-4 border-blue-500 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Assignments</p>
              <p className="text-2xl font-bold">
                {assignments.filter((a) => new Date(a.dueDate) > new Date()).length}
              </p>
            </div>
          </div>
          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 border-l-4 border-green-500 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaBook className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Courses</p>
              <p className="text-2xl font-bold">{uniqueCourses.length - 1}</p>
            </div>
          </div>
          <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 border-l-4 border-purple-500 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaFilter className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Filtered</p>
              <p className="text-2xl font-bold">{filteredAssignments.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow">
          <div className="w-full sm:w-auto">
            <label className="block text-gray-700 font-medium mb-1">Filter by Course:</label>
            <div className="relative max-w-xs">
              <select
                className="w-full p-3 pl-10 rounded-lg border border-gray-300"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-3 text-gray-500">
                <FaFilter />
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-gray-700 font-medium mb-1">Filter by Status:</label>
            <div className="relative max-w-xs">
              <select
                className="w-full p-3 pl-10 rounded-lg border border-gray-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Finished">Finished</option>
              </select>
              <div className="absolute left-3 top-3 text-gray-500">
                <FaCalendarAlt />
              </div>
            </div>
          </div>
        </div>

        {/* Assignment List */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Assignments Found</h3>
            <p className="text-gray-600">Create your first assignment to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAssignments.map((assignment) => {
              const isPastDue = new Date(assignment.dueDate) < new Date();
              const isExpanded = expandedAssignment === assignment._id;
              return (
                <div
                  key={assignment._id}
                  className={`bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden ${
                    isExpanded ? "border-l-4 border-indigo-500" : ""
                  }`}
                >
                  <div className="p-5 cursor-pointer" onClick={() => toggleAssignment(assignment._id)}>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                            <FaBook className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Link
                                to={`/instructor-dashboard/instructorSubmissions/${assignment._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-indigo-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {assignment.title}
                              </Link>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {assignment.courseId?.name || "Unknown Course"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                              <FaCalendarAlt className="inline-block mr-1.5 text-gray-500" />
                              Due: {format(new Date(assignment.dueDate), "PPP 'at' p")}
                              {isPastDue && (
                                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Submission closed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(assignment);
                          }}
                          disabled={isPastDue}
                          className={`px-4 py-2 rounded-lg font-medium transition flex items-center ${
                            isPastDue
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          }`}
                        >
                          <FaEdit className="mr-1.5" /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(assignment._id);
                          }}
                          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition flex items-center"
                        >
                          <FaTrash className="mr-1.5" /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-center mt-3">
                      <FaChevronRight
                        className={`text-gray-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {assignment.description || "No description provided"}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Link
                          to={`/instructor-dashboard/instructorSubmissions/${assignment._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                        >
                          View submissions <FaChevronRight className="ml-1 text-xs" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal (Edit) */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl transform transition-all">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Edit Assignment</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Assignment title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Assignment description"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Due Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Update Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorAssignmentList;
