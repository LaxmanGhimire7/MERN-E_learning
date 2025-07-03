import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

function InstructorAssignmentList() {
  const { state } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
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

    fetchAssignments();
  }, [state.token]);

  if (loading) return <p>Loading assignments...</p>;
  if (assignments.length === 0) return <p>No assignments found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Assignments</h2>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id} className="mb-2">
            <Link
              to={`/instructor-dashboard/instructorSubmissions/${assignment._id}`}
              className="text-blue-600 underline"
            >
              {assignment.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InstructorAssignmentList;
