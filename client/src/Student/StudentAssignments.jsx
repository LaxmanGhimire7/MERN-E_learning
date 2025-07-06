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
        toast.error("❌ Failed to fetch submissions.");
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
      toast.warn("⚠️ Please select a file before submitting.");
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
        toast.success("✅ Assignment submitted successfully!");
        setSubmissions((prev) => ({ ...prev, [assignmentId]: data.submission }));
        setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      } else {
        toast.error(data.msg || "❌ Submission failed");
      }
    } catch (err) {
      toast.error("❌ Server error while submitting.");
    } finally {
      setUploading((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-6xl" />
        <p className="ml-4 text-xl text-gray-700">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 text-lg text-center">{error}</p>
        <p className="text-gray-500 mt-4">Please try refreshing the page.</p>
      </div>
    );
  }

  const filteredAssignments = assignments.filter((a) => !isPastDue(a.dueDate));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <h2 className="text-5xl font-extrabold text-center text-blue-900 mb-12 drop-shadow-sm flex items-center justify-center gap-4">
        <FaGraduationCap className="text-blue-700" /> Student Assignments
      </h2>

      {filteredAssignments.length === 0 ? (
        <div className="bg-white text-blue-700 p-8 rounded-xl shadow-lg text-center max-w-xl mx-auto border-t-4 border-blue-400">
          <FaBook className="inline-block mr-3 text-3xl" />
          <span className="text-xl font-medium">No assignments available at the moment. Check back later!</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredAssignments.map((assignment) => {
            const id = assignment._id;
            const submitted = submissions[id];
            const selectedFile = selectedFiles[id];

            const statusColor = submitted
              ? "bg-green-500"
              : "bg-yellow-500";
            const statusText = submitted ? "Submitted" : "Pending";
            const statusIcon = submitted ? <FaCheckCircle /> : <FaClock />;

            return (
              <div key={id} className="flex flex-col bg-white rounded-3xl shadow-xl border-b-4 border-blue-400 overflow-hidden">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <FaBook className="text-blue-600" /> {assignment.title}
                    </h3>
                    <span className={`text-sm px-4 py-2 rounded-full font-bold text-white flex items-center gap-2 ${statusColor}`}>
                      {statusIcon} {statusText}
                    </span>
                  </div>

                  <p className="text-md text-blue-700 mb-3 font-semibold flex items-center gap-2">
                    <FaGraduationCap className="text-blue-500" />
                    {assignment.courseId?.name || "Unknown Course"}
                  </p>

                  <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span className="font-medium">Due:</span> {formatDate(assignment.dueDate)}
                  </p>

                  <p className="text-base text-gray-700 mb-6 leading-relaxed">
                    {assignment.description || "No description provided for this assignment."}
                  </p>

                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg text-green-800 text-base shadow-inner">
                      <p className="mb-3 flex items-center gap-2">
                        <FaPaperclip className="text-green-600 text-lg" />
                        Submitted File:{" "}
                        <a
                          href={`http://localhost:9000/assignment/${submitted.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-700 hover:text-blue-900 font-medium transition-colors"
                        >
                          View Submission
                        </a>
                      </p>
                      {submitted.feedback && (
                        <p className="mb-3 flex items-center gap-2">
                          <FaCommentDots className="text-green-600 text-lg" /> Feedback:{" "}
                          <span className="font-semibold">{submitted.feedback}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <FaFileAlt className="text-green-600 text-lg" /> Grade:{" "}
                        <span className="font-bold text-lg">
                          {submitted.grade ? `${submitted.grade}%` : "Not graded yet"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <label htmlFor={`file-upload-${id}`} className="block mb-3 font-medium text-base text-gray-700 cursor-pointer">
                        <FaFileUpload className="inline mr-2 text-blue-600" /> Upload your assignment file:
                      </label>
                      <input
                        id={`file-upload-${id}`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(id, e.target.files[0])}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200 cursor-pointer mb-3"
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                          <FaPaperclip /> Selected: <span className="font-medium">{selectedFile.name}</span>
                        </p>
                      )}
                      <button
                        onClick={() => handleSubmit(id, assignment.courseId?._id)}
                        className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-3 ${
                          uploading[id] || !selectedFile
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
                        }`}
                      >
                        {uploading[id] ? (
                          <>
                            <FaSpinner className="animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> Submit Assignment
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
