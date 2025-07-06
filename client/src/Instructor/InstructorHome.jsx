import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function InstructorHome() {
  const { state } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, assignmentRes, submissionRes, studentRes] = await Promise.all([
        fetch("http://localhost:9000/api/course/all", {
          headers: { Authorization: `Bearer ${state.token}` },
        }),
        fetch("http://localhost:9000/api/assignmentSubmission/instructor", {
          headers: { Authorization: `Bearer ${state.token}` },
        }),
        fetch("http://localhost:9000/api/assignmentSubmission/all-submissions", {
          headers: { Authorization: `Bearer ${state.token}` },
        }),
        fetch("http://localhost:9000/api/user/students", {
          headers: { Authorization: `Bearer ${state.token}` },
        }),
      ]);

      const [coursesData, assignmentsData, submissionsData, studentsData] = await Promise.all([
        courseRes.json(),
        assignmentRes.json(),
        submissionRes.json(),
        studentRes.json(),
      ]);

      setCourses(coursesData.courses || []);
      setAssignments(assignmentsData.assignments || []);
      setSubmissions(submissionsData.submissions || []);
      setStudents(studentsData.students || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const assignmentStats = assignments.map((a) => {
    const total = students.length;
    const submitted = submissions.filter((s) => s.assignmentId === a._id).length;
    return { title: a.title, total, submitted };
  });

  const pieData = {
    labels: courses.map((c) => c.name),
    datasets: [
      {
        label: "Enrolled Students",
        data: courses.map((c) => c.enrolledCount || 0),
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: assignmentStats.map((a) => a.title),
    datasets: [
      {
        label: "Submitted",
        data: assignmentStats.map((a) => a.submitted),
        backgroundColor: "#4ade80",
      },
      {
        label: "Not Submitted",
        data: assignmentStats.map((a) => a.total - a.submitted),
        backgroundColor: "#f87171",
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Instructor Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Enrollment by Course</h2>
          <Pie data={pieData} />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Assignment Submission Stats</h2>
          <Bar data={barData} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Assignment Table</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not Submitted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignmentStats.map((a, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">{a.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignments[i].dueDate?.slice(0, 10)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignments[i].courseId?.name || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.submitted}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.total - a.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstructorHome;
