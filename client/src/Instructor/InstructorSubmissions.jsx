import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

function InstructorSubmissions() {
  const { assignmentId } = useParams();
  const { state } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [graded, setGraded] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `http://localhost:9000/api/assignmentSubmission/instructor/${assignmentId}`,
          {
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.submissions || []);
          setAssignmentTitle(data.assignment?.title || "Assignment");
          const gradesMap = {}, feedbacksMap = {}, gradedMap = {};
          data.submissions.forEach((s) => {
            gradesMap[s._id] = s.grade || "";
            feedbacksMap[s._id] = s.feedback || "";
            gradedMap[s._id] = !!s.grade;
          });
          setGrades(gradesMap);
          setFeedbacks(feedbacksMap);
          setGraded(gradedMap);
        } else {
          console.error("Failed to load submissions");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId, state.token]);

  const handleSubmit = async (id) => {
    try {
      const res = await fetch(`http://localhost:9000/api/assignmentSubmission/grade/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          grade: grades[id],
          feedback: feedbacks[id],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Graded successfully");
        setGraded((prev) => ({ ...prev, [id]: true }));
      } else {
        alert(data.msg || "Failed to grade");
      }
    } catch {
      alert("Error grading");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{assignmentTitle} - Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((sub) => (
          <div key={sub._id} className="bg-white p-4 shadow rounded mb-4">
            <p>
              <strong>Student:</strong>{" "}
              {sub.studentId?.firstName} {sub.studentId?.lastName} ({sub.studentId?.email})
            </p>
            <p>
              <strong>File:</strong>{" "}
              <a
                href={`http://localhost:9000/assignment/${sub.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            </p>
            <div className="mt-2">
              <label className="block font-medium">Grade</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={grades[sub._id]}
                onChange={(e) => setGrades((prev) => ({ ...prev, [sub._id]: e.target.value }))}
                disabled={graded[sub._id]}
              />
            </div>
            <div className="mt-2">
              <label className="block font-medium">Feedback</label>
              <textarea
                className="w-full p-2 border rounded"
                value={feedbacks[sub._id]}
                onChange={(e) => setFeedbacks((prev) => ({ ...prev, [sub._id]: e.target.value }))}
                disabled={graded[sub._id]}
              />
            </div>
            <button
              onClick={() => handleSubmit(sub._id)}
              disabled={graded[sub._id]}
              className={`mt-3 px-4 py-2 rounded text-white ${
                graded[sub._id] ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {graded[sub._id] ? "Graded" : "Save"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default InstructorSubmissions;
