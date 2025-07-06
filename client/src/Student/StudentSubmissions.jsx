import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

function StudentSubmissions() {
  const { state } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:9000/api/assignmentSubmission/student-submissions", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load submissions");
        setSubmissions(data.submissions || []);
      } catch (err) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [state.token]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading your submissions...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (submissions.length === 0) return <p className="text-center mt-10 ml-16 text-gray-600">You have no submissions yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">My Assignment Submissions</h1>
      <ul className="space-y-6">
        {submissions.map((sub) => (
          <li
            key={sub._id}
            className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {sub.assignmentId?.title || "Untitled Assignment"}
                </h2>
                <p className="text-gray-600 mt-1">
                  Due Date:{" "}
                  {sub.assignmentId?.dueDate
                    ? new Date(sub.assignmentId.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <a
                href={`http://localhost:9000/assignment/${sub.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                aria-label={`View submitted file for ${sub.assignmentId?.title || "assignment"}`}
              >
                View Submitted File
              </a>
            </div>

            {(sub.grade || sub.feedback) && (
              <div className="mt-4 border-t pt-4">
                {sub.grade && (
                  <p className="text-gray-800 font-semibold">
                    Grade: <span className="text-green-600">{sub.grade}</span>
                  </p>
                )}
                {sub.feedback && (
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    <strong>Feedback:</strong> {sub.feedback}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentSubmissions;
