import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

function InstructorSubmissions() {
  const { assignmentId } = useParams();
  const { state } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [grades, setGrades] = useState({});
  const [gradedSubmissions, setGradedSubmissions] = useState({});

  useEffect(() => {
    if (!assignmentId) return;

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `http://localhost:9000/api/assignmentSubmission/instructor/${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.submissions || []);

          // Initialize feedback and grades states
          const fb = {};
          const gr = {};
          const graded = {};
          data.submissions.forEach((sub) => {
            fb[sub._id] = sub.feedback || "";
            gr[sub._id] = sub.grade || "";
            graded[sub._id] = !!sub.grade; // Mark as graded if grade exists
          });
          setFeedbacks(fb);
          setGrades(gr);
          setGradedSubmissions(graded);
        } else {
          console.error("Failed to load submissions");
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId, state.token]);

  const handleSubmitGrade = async (submissionId) => {
    setGrading((prev) => ({ ...prev, [submissionId]: true }));
    try {
      const res = await fetch(
        `http://localhost:9000/api/assignmentSubmission/grade/${submissionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({
            grade: grades[submissionId],
            feedback: feedbacks[submissionId],
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Graded successfully");
        setGradedSubmissions((prev) => ({ ...prev, [submissionId]: true }));
      } else {
        alert(data.msg || "Failed to submit grade");
      }
    } catch (err) {
      console.error("Grade submission failed", err);
      alert("Error submitting grade");
    } finally {
      setGrading((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Submissions for Assignment</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((sub) => (
          <div
            key={sub._id}
            className="border p-4 mb-4 rounded shadow bg-white"
          >
            <p>
              <strong>Student:</strong> {sub.studentId?.firstName}{" "}
              {sub.studentId?.lastName} ({sub.studentId?.email})
            </p>
            <p>
              <strong>File:</strong>{" "}
              <a
                href={`http://localhost:9000/assignment/${sub.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Submission
              </a>
            </p>

            <div className="mt-2">
              <label className="block font-semibold mb-1">Grade:</label>
              <input
                type="text"
                className="border p-1 w-full rounded"
                value={grades[sub._id]}
                onChange={(e) =>
                  setGrades((prev) => ({
                    ...prev,
                    [sub._id]: e.target.value,
                  }))
                }
                disabled={gradedSubmissions[sub._id]} // disable if graded
              />
            </div>

            <div className="mt-2">
              <label className="block font-semibold mb-1">Feedback:</label>
              <textarea
                rows={3}
                className="border p-2 w-full rounded"
                value={feedbacks[sub._id]}
                onChange={(e) =>
                  setFeedbacks((prev) => ({
                    ...prev,
                    [sub._id]: e.target.value,
                  }))
                }
                disabled={gradedSubmissions[sub._id]} // disable if graded
              />
            </div>

            <button
              onClick={() => handleSubmitGrade(sub._id)}
              disabled={grading[sub._id] || gradedSubmissions[sub._id]}
              className={`mt-3 px-4 py-2 rounded text-white ${
                grading[sub._id] || gradedSubmissions[sub._id]
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {grading[sub._id]
                ? "Saving..."
                : gradedSubmissions[sub._id]
                ? "Graded"
                : "Save Grade & Feedback"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default InstructorSubmissions;
