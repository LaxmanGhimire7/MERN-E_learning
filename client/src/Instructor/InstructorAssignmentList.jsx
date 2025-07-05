import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

function InstructorAssignmentList() {
  const { state } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [state.token]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9000/api/assignmentSubmission/instructor", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
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

  const openEditModal = (assignment) => {
    setEditData(assignment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEditData({ ...editData, attachment: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("description", editData.description);
      formData.append("dueDate", editData.dueDate);
      formData.append("assignToAll", true);
      if (editData.attachment instanceof File) {
        formData.append("attachment", editData.attachment);
      }

      const res = await fetch(`http://localhost:9000/api/assignment/updateAssignment/${editData._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("Assignment updated successfully");
        fetchAssignments();
        closeModal();
      } else {
        alert(data.msg || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Update error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const res = await fetch(`http://localhost:9000/api/assignment/deleteAssignment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Deleted successfully");
        fetchAssignments();
      } else {
        alert(data.msg || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  if (loading) return <p>Loading assignments...</p>;
  if (assignments.length === 0) return <p>No assignments found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id} className="mb-4 border-b pb-2">
            <div className="flex justify-between items-center">
              <Link
                to={`/instructor-dashboard/instructorSubmissions/${assignment._id}`}
                className="text-blue-600 underline"
              >
                {assignment.title}
              </Link>
              <div className="space-x-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded"
                  onClick={() => openEditModal(assignment)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(assignment._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Assignment</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={editData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="date"
                name="dueDate"
                value={editData.dueDate?.substring(0, 10)}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="file"
                name="attachment"
                onChange={handleFileChange}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorAssignmentList;
