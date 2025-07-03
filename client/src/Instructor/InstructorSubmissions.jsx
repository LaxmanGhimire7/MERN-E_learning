import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { useParams } from "react-router-dom";

function InstructorSubmissions({ assignmentId }) {
    const { assignmentId } = useParams();
  const { state } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({}); // track grading status
  const [feedbacks, setFeedbacks] = useState({});
  const [grades, setGrades] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`http://localhost:9000/api/assignmentSubmission/instructor/${assignmentId}`, {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.submissions);

          // Initialize feedback and grades from fetched data
          const fb = {};
          const gr = {};
          data.submissions.forEach(sub => {
            fb[sub._id] = sub.feedback || "";
            gr[sub._id] = sub.grade || "";
          });
          setFeedbacks(fb);
          setGrades(gr);
        } else {
          alert(data.msg || "Failed to load submissions");
        }
      } catch (error) {
        console.error(error);
        alert("Error loading submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId, state.token]);

  const handleGradeChange = (submissionId, value) => {
    setGrades(prev => ({ ...prev, [submissionId]: value }));
  };

  const handleFeedbackChange = (submissionId, value) => {
    setFeedbacks(prev => ({ ...prev, [submissionId]: value }));
  };

  const handleSubmitGrade = async (submissionId) => {
    setGrading(prev => ({ ...prev, [submissionId]: true }));
    try {
      const res = await fetch(`http://localhost:9000/api/assignmentSubmission/grade/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          grade: grades[submissionId],
          feedback: feedbacks[submissionId],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Graded successfully");
        setSubmissions(prev => prev.map(s => (s._id === submissionId ? data.submission : s)));
      } else {
        alert(data.msg || "Failed to grade");
      }
    } catch (error) {
      console.error(error);
      alert("Error grading submission");
    } finally {
      setGrading(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Submissions for Assignment</h2>
      {submissions.length === 0 && <p>No submissions yet.</p>}

      {submissions.map((sub) => (
        <div key={sub._id} className="border p-4 mb-4 rounded shadow">
          <p><strong>Student:</strong> {sub.studentId.firstName} {sub.studentId.lastName} ({sub.studentId.email})</p>
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
            <label className="block font-semibold mb-1" htmlFor={`grade-${sub._id}`}>
              Grade:
            </label>
            <input
              id={`grade-${sub._id}`}
              type="text"
              value={grades[sub._id]}
              onChange={(e) => handleGradeChange(sub._id, e.target.value)}
              className="border rounded p-1 w-full"
            />
          </div>

          <div className="mt-2">
            <label className="block font-semibold mb-1" htmlFor={`feedback-${sub._id}`}>
              Feedback:
            </label>
            <textarea
              id={`feedback-${sub._id}`}
              rows={3}
              value={feedbacks[sub._id]}
              onChange={(e) => handleFeedbackChange(sub._id, e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <button
            onClick={() => handleSubmitGrade(sub._id)}
            disabled={grading[sub._id]}
            className={`mt-3 px-4 py-2 rounded text-white ${
              grading[sub._id] ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {grading[sub._id] ? "Saving..." : "Save Grade & Feedback"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default InstructorSubmissions;
