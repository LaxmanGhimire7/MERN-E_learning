import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import {
  FaBook,
  FaFileAlt,
  FaUserGraduate,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function InstructorHome() {
  const { state } = useContext(AuthContext);
  const token = state?.token;

  // State data
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState({}); // {courseId: enrolledCount}
  const [submissions, setSubmissions] = useState({}); // {assignmentId: submittedCount}
  const [pendingGradingCount, setPendingGradingCount] = useState(0);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [dueSoonAssignments, setDueSoonAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility to format date nicely
  const formatDate = (d) => new Date(d).toLocaleDateString();

  // Fetch assignments, enrollments, submissions, pending grading count
  useEffect(() => {
    if (!token) return;

    async function loadData() {
      setLoading(true);
      try {
        // 1. Fetch instructor assignments
        const resAssignments = await fetch(
          "http://localhost:9000/api/assignmentSubmission/instructor",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resAssignments.ok)
          throw new Error("Failed to fetch assignments");

        const assignmentsData = await resAssignments.json();
        const assignmentsList = assignmentsData.assignments || [];
        setAssignments(assignmentsList);


       const uniqueCourseIds = [
  ...new Set(assignmentsList.map((a) => a.courseId?._id).filter(Boolean)), // <- filter undefined/null
];


        const enrollmentCounts = {};
        for (const courseId of uniqueCourseIds) {
  if (!courseId) continue; // Skip if undefined
  console.log("Fetching enrollment count for:", courseId);
  const resEnroll = await fetch(
    `http://localhost:9000/api/order/enrollments/count/${courseId}`,
    { headers: { Authorization: `Bearer ${token}` } }
          );
          if (resEnroll.ok) {
            const data = await resEnroll.json();
            enrollmentCounts[courseId] = data.count || 0;
          } else {
            enrollmentCounts[courseId] = 0;
          }
        }
        setEnrollments(enrollmentCounts);

        // 3. For each assignment, fetch submissions count
        // We'll get all submissions for each assignment and count
        const submissionsCounts = {};
        let totalPendingGrading = 0;
        const allSubmissions = [];

        for (const assignment of assignmentsList) {
          const resSubs = await fetch(
            `http://localhost:9000/api/assignmentSubmission/instructor/${assignment._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (resSubs.ok) {
            const data = await resSubs.json();
            submissionsCounts[assignment._id] = data.submissions.length;

            // Count how many are pending grading (grade === null or undefined)
            totalPendingGrading += data.submissions.filter(
              (s) => s.grade === null || s.grade === undefined
            ).length;

            // For recent submissions list, gather all
            allSubmissions.push(
  ...data.submissions.map((s) => {
    const student = s.studentId;
    return {
      id: s._id,
      assignmentTitle: assignment.title,
      studentName: student
        ? `${student.firstName || "Unknown"} ${student.lastName || ""}`
        : "Unknown Student",
      submittedAt: s.createdAt || s.updatedAt,
      graded: s.grade !== null && s.grade !== undefined,
    };
  })
);

          } else {
            submissionsCounts[assignment._id] = 0;
          }
        }
        setSubmissions(submissionsCounts);
        setPendingGradingCount(totalPendingGrading);

        // 4. Recent submissions - last 5, sorted by date desc
        allSubmissions.sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
        setRecentSubmissions(allSubmissions.slice(0, 5));

        // 5. Assignments due soon (due in next 7 days)
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const dueSoon = assignmentsList.filter((a) => {
          const due = new Date(a.dueDate);
          return due >= now && due <= nextWeek;
        });
        setDueSoonAssignments(dueSoon);

        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  // Pie chart data
  const totalSubmitted = Object.values(submissions).reduce(
    (acc, val) => acc + val,
    0
  );
  const totalAssignmentsCount = assignments.length;
  const totalPending = totalAssignmentsCount * Math.max(...Object.values(enrollments), 0) - totalSubmitted;

  const pieData = {
    labels: ["Submitted", "Pending"],
    datasets: [
      {
        label: "Assignment Submission Status",
        data: [totalSubmitted, totalPending < 0 ? 0 : totalPending],
        backgroundColor: ["#2563EB", "#FBBF24"],
        hoverBackgroundColor: ["#1E40AF", "#D97706"],
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg text-center">
          <FaBook className="mx-auto text-3xl mb-2" />
          <h3 className="text-3xl font-bold">{new Set(assignments.map((a) => a.courseId?._id)).size}</h3>
          <p>Courses Taught</p>
        </div>
        <div className="bg-green-600 text-white rounded-lg p-6 shadow-lg text-center">
          <FaFileAlt className="mx-auto text-3xl mb-2" />
          <h3 className="text-3xl font-bold">{assignments.length}</h3>
          <p>Assignments Created</p>
        </div>
        <div className="bg-yellow-600 text-white rounded-lg p-6 shadow-lg text-center">
          <FaUserGraduate className="mx-auto text-3xl mb-2" />
          <h3 className="text-3xl font-bold">{Object.values(enrollments).reduce((a, b) => a + b, 0)}</h3>
          <p>Students Enrolled</p>
        </div>
        <div className="bg-red-600 text-white rounded-lg p-6 shadow-lg text-center">
          <FaHourglassHalf className="mx-auto text-3xl mb-2" />
          <h3 className="text-3xl font-bold">{pendingGradingCount}</h3>
          <p>Pending Grading</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="max-w-md mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Assignment Submission Status
        </h2>
        <Pie data={pieData} />
      </div>

      {/* Assignments Table */}
      <div className="overflow-x-auto max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Assignments Overview</h2>
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Assignment Title</th>
              <th className="py-3 px-6 text-left">Course</th>
              <th className="py-3 px-6 text-left">Due Date</th>
              <th className="py-3 px-6 text-center">Enrolled Students</th>
              <th className="py-3 px-6 text-center">Submitted</th>
              <th className="py-3 px-6 text-center">Pending Grading</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => {
              const courseId = assignment.courseId?._id;
              const enrolledCount = enrollments[courseId] || 0;
              const submittedCount = submissions[assignment._id] || 0;
              // For pending grading per assignment, assume:
              // We can’t get it easily without a separate call, so let's show dash or 0
              const pendingGrade = "-";

              return (
                <tr
                  key={assignment._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6">{assignment.title}</td>
                  <td className="py-3 px-6">{assignment.courseId?.name || "N/A"}</td>
                  <td className="py-3 px-6">{formatDate(assignment.dueDate)}</td>
                  <td className="py-3 px-6 text-center">{enrolledCount}</td>
                  <td className="py-3 px-6 text-center">{submittedCount}</td>
                  <td className="py-3 px-6 text-center">{pendingGrade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Submissions */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
        {recentSubmissions.length === 0 ? (
          <p>No recent submissions.</p>
        ) : (
          <ul className="space-y-3">
            {recentSubmissions.map((sub) => (
              <li
                key={sub.id}
                className="border rounded p-4 flex justify-between items-center bg-white shadow"
              >
                <div>
                  <p>
                    <strong>{sub.studentName}</strong> submitted{" "}
                    <em>{sub.assignmentTitle}</em>
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  {sub.graded ? (
                    <FaCheckCircle className="text-green-600 text-xl" title="Graded" />
                  ) : (
                    <FaHourglassHalf className="text-yellow-600 text-xl" title="Pending Grading" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Assignments Due Soon */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Assignments Due Soon (Next 7 days)</h2>
        {dueSoonAssignments.length === 0 ? (
          <p>No assignments due soon.</p>
        ) : (
          <ul className="space-y-3">
            {dueSoonAssignments.map((assignment) => (
              <li
                key={assignment._id}
                className="border rounded p-4 bg-white shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-gray-600">
                    Course: {assignment.courseId?.name || "N/A"}
                  </p>
                </div>
                <div className="text-red-600 font-bold">
                  Due: {formatDate(assignment.dueDate)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default InstructorHome;
