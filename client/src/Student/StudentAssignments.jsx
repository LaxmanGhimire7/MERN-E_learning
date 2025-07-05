import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

function StudentAssignments() {
  const { state } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setError(null);
        const res = await fetch("http://localhost:9000/api/assignmentSubmission/student", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load assignments");
        setAssignments(data.assignments || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/assignmentSubmission/student-submissions", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load submissions");

        const map = {};
        data.submissions.forEach((sub) => {
          const id = sub.assignmentId._id || sub.assignmentId;
          map[id] = sub;
        });
        setSubmissions(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
    fetchSubmissions();
  }, [state.token]);

  const handleFileChange = (assignmentId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = async (assignmentId, courseId) => {
    const file = selectedFiles[assignmentId];
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }
    setUploading((prev) => ({ ...prev, [assignmentId]: true }));

    const formData = new FormData();
    formData.append("assignmentFile", file);
    formData.append("assignmentId", assignmentId);
    formData.append("courseId", courseId);

    try {
      const res = await fetch("http://localhost:9000/api/assignmentSubmission/submit", {
        method: "POST",
        headers: { Authorization: `Bearer ${state.token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Assignment submitted successfully");
        setSubmissions((prev) => ({ ...prev, [assignmentId]: data.submission }));
        setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      } else {
        alert(data.msg || "Submission failed");
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("Submission error, please try again");
    } finally {
      setUploading((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  const isPastDue = (dueDate) => new Date(dueDate) < new Date();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Assignments</h2>

      {assignments.length === 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
          <p>No assignments assigned yet.</p>
        </div>
      )}

      {assignments.map((assignment) => {
        const id = assignment._id || assignment.id;
        const submitted = submissions[id];
        const selectedFile = selectedFiles[id];
        const pastDue = isPastDue(assignment.dueDate);

        return (
          <div key={id} className="border rounded-xl p-6 mb-6 shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-1">{assignment.title || "Untitled Assignment"}</h3>
            <p className="text-gray-600 mb-1">
              Course:{" "}
              <span className="font-medium">
                {assignment.courseId?.name || assignment.courseId?._id || "N/A"}
              </span>
            </p>
            <p className="text-gray-600 mb-2">
              Due Date:{" "}
              {assignment.dueDate
                ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not specified"}
            </p>
            <p className="mb-4">{assignment.description || "No description provided."}</p>

            {submitted ? (
              <div className="text-green-700">
                <p>
                  ✅ Submitted:{" "}
                  <a
                    href={`http://localhost:9000/assignment/${submitted.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700"
                  >
                    View Submitted File
                  </a>
                </p>
                {submitted.feedback && (
                  <div className="mt-2 bg-gray-100 p-3 rounded">
                    <p>
                      <strong>Feedback:</strong> {submitted.feedback}
                    </p>
                    <p>
                      <strong>Grade:</strong> {submitted.grade ?? "Not graded yet"}
                    </p>
                  </div>
                )}
              </div>
            ) : pastDue ? (
              <div className="text-red-600 font-semibold">⛔ Submission time has ended</div>
            ) : (
              <div>
                <label className="block mb-2 font-medium">Upload your submission:</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(id, e.target.files[0])}
                  className="border rounded p-2 w-full mb-3"
                />
                <button
                  disabled={uploading[id]}
                  onClick={() => handleSubmit(id, assignment.courseId?._id)}
                  className={`px-4 py-2 rounded font-semibold text-white ${
                    uploading[id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {uploading[id] ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StudentAssignments;
