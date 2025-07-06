import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import {
  FaBook,
  FaFileUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPaperclip,
  FaCommentDots,
  FaFileAlt,
  FaGraduationCap,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";

function StudentAssignments() {
  const { state } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPastDue = (dueDate) => new Date(dueDate) < new Date();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/assignmentSubmission/student", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load assignments");
        setAssignments(data.assignments || []);
      } catch (err) {
        setError(err.message);
        toast.error(`Error loading assignments: ${err.message}`);
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
        toast.error("\u274C Failed to fetch submissions.");
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
      toast.warn("\u26A0\uFE0F Please select a file before submitting.");
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
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
        toast.success("\u2705 Assignment submitted successfully!");
        setSubmissions((prev) => ({ ...prev, [assignmentId]: data.submission }));
        setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      } else {
        toast.error(data.msg || "Submission failed");
      }
    } catch (err) {
      toast.error("Server error while submitting.");
    } finally {
      setUploading((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <FaSpinner className="animate-spin text-blue-600 text-7xl mb-6" />
        <p className="text-xl font-semibold text-blue-800">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-6">
        <FaExclamationTriangle className="text-red-600 text-7xl mb-4" />
        <h2 className="text-3xl font-extrabold text-red-700 mb-3">Error Loading Data</h2>
        <p className="text-red-600 text-lg max-w-md text-center">{error}</p>
        <p className="text-red-400 mt-5">Please try refreshing the page.</p>
      </div>
    );
  }

  const filteredAssignments = assignments.filter((a) => !isPastDue(a.dueDate));

  return (
    <div className="min-h-screen ml-44 px-4 sm:px-6 py-14">
      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-12 flex items-center justify-center gap-4">
        <FaGraduationCap className="text-blue-700" /> Student Assignments
      </h2>

      {filteredAssignments.length === 0 ? (
        <div className="bg-white text-blue-700 p-10 rounded-xl shadow-lg text-center max-w-xl mx-auto border-t-4 border-blue-400">
          <FaBook className="inline-block mr-4 text-4xl" />
          <span className="text-2xl font-semibold">
            No assignments available at the moment. Check back later!
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {filteredAssignments.map((assignment) => {
            const id = assignment._id;
            const submitted = submissions[id];
            const selectedFile = selectedFiles[id];

            const statusColor = submitted
              ? "bg-green-500 shadow-green-400/70"
              : "bg-yellow-500 shadow-yellow-400/70";
            const statusText = submitted ? "Submitted" : "Pending";
            const statusIcon = submitted ? <FaCheckCircle /> : <FaClock />;

            return (
              <div
                key={id}
                className="flex flex-col w-full sm:w-[500px] bg-white rounded-2xl shadow-lg border-b-4 border-blue-400 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FaBook className="text-blue-600" /> {assignment.title}
                    </h3>
                    <span
                      className={`text-sm px-4 py-1 rounded-full font-semibold text-white flex items-center gap-1 shadow-md ${statusColor}`}
                    >
                      {statusIcon} {statusText}
                    </span>
                  </div>

                  <p className="text-sm text-blue-700 mb-2 font-semibold flex items-center gap-2">
                    <FaGraduationCap className="text-blue-500" />
                    {assignment.courseId?.name || "Unknown Course"}
                  </p>

                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                    <FaClock /> Due: {formatDate(assignment.dueDate)}
                  </p>

                 {assignment.attachment && (
  <p className="text-sm text-red-700 mb-4 flex items-center gap-2">
    <FaPaperclip className="text-red-600" />
    Assignment File:{" "}
    <a
      href={`http://localhost:9000/assignment/${assignment.attachment}`}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-blue-700 hover:text-blue-900 font-medium"
    >
      View / Download
    </a>
  </p>
)}


                  {submitted ? (
                    <div className="bg-green-50 border border-green-300 p-4 rounded-lg text-green-900 text-sm shadow-inner">
                      <p className="mb-2 flex items-center gap-2">
                        <FaPaperclip className="text-green-600" /> Submitted File: {" "}
                        <a
                          href={`http://localhost:9000/assignment/${submitted.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-700 hover:text-blue-900 font-medium"
                        >
                          View
                        </a>
                      </p>
                      {submitted.feedback && (
                        <p className="mb-2 flex items-center gap-2">
                          <FaCommentDots className="text-green-600" /> Feedback: {submitted.feedback}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <FaFileAlt className="text-green-600" /> Grade: {" "}
                        <span className="font-semibold">
                          {submitted.grade ? `${submitted.grade}%` : "Not graded yet"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor={`file-upload-${id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaFileUpload className="inline mr-1 text-blue-600" /> Upload your assignment:
                      </label>
                      <input
                        id={`file-upload-${id}`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(id, e.target.files[0])}
                        className="mb-3 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {selectedFile && (
                        <p className="text-xs text-gray-600 mb-3 flex items-center gap-2">
                          <FaPaperclip /> Selected: <span className="font-medium">{selectedFile.name}</span>
                        </p>
                      )}
                      <button
                        onClick={() => handleSubmit(id, assignment.courseId?._id)}
                        disabled={uploading[id] || !selectedFile}
                        className={`w-full py-2 rounded-md text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                          uploading[id] || !selectedFile
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
                        }`}
                      >
                        {uploading[id] ? (
                          <>
                            <FaSpinner className="animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> Submit
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentAssignments;
