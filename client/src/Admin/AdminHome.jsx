import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";
import {
  FaBookOpen,
  FaEnvelope,
  FaUsers,
  FaTrashAlt,
  FaChartPie,
  FaChartLine,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

function AdminHome() {
  const [latestCourses, setLatestCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  // Stats for charts
  const [userStats, setUserStats] = useState([]); // [{month:'2025-01', count: 10}]
  const [courseStats, setCourseStats] = useState([]); // [{month:'2025-01', count: 5}]
  const [messageStatus, setMessageStatus] = useState({ read: 0, unread: 0 });

  const { state } = useContext(AuthContext);

  // Fetch courses
  const getCourses = async () => {
    try {
      let res = await fetch("http://localhost:9000/api/course/getAllCourse");
      let data = await res.json();
      const latest = data.response.slice(-5).reverse();
      setLatestCourses(latest);
      setCoursesCount(data.response.length);
      // Optional: calculate categories or active courses here for charts
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch contacts
  const getContacts = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/contact/getAllContacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      let data = await response.json();
      const msgs = data.response || data.contacts || data || [];
      setContacts(msgs);
      setMessagesCount(msgs.length);

      // Count read vs unread assuming contacts have 'read' boolean field
      const readCount = msgs.filter((m) => m.read).length;
      setMessageStatus({ read: readCount, unread: msgs.length - readCount });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contact messages");
    }
  };

  // Fetch user stats for line chart
  const getUserStats = async () => {
    try {
      let res = await fetch("http://localhost:9000/api/user/stats");
      if (!res.ok) throw new Error("Failed to fetch user stats");
      let data = await res.json();
      setUserStats(data.stats || []);
      // Also total user count for card
      const totalUsers = data.stats.reduce((acc, cur) => acc + cur.count, 0);
      setUsersCount(totalUsers);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch course stats for line chart
  const getCourseStats = async () => {
    try {
      let res = await fetch("http://localhost:9000/api/course/stats");
      if (!res.ok) throw new Error("Failed to fetch course stats");
      let data = await res.json();
      setCourseStats(data.stats || []);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      let response = await fetch(`http://localhost:9000/api/contact/deleteContact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Message deleted successfully");
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
      setMessagesCount((c) => c - 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  useEffect(() => {
    getCourses();
    getContacts();
    getUserStats();
    getCourseStats();
  }, []);

  // Pie chart for message read/unread
  const pieData = {
    labels: ["Read Messages", "Unread Messages"],
    datasets: [
      {
        data: [messageStatus.read, messageStatus.unread],
        backgroundColor: ["#10B981", "#F59E0B"],
        hoverBackgroundColor: ["#059669", "#B45309"],
      },
    ],
  };

  // Line chart for user registrations
  const lineUserData = {
    labels: userStats.map((item) => item.month),
    datasets: [
      {
        label: "New Users",
        data: userStats.map((item) => item.count),
        fill: false,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.3,
      },
    ],
  };

  // Line chart for course additions
  const lineCourseData = {
    labels: courseStats.map((item) => item.month),
    datasets: [
      {
        label: "New Courses",
        data: courseStats.map((item) => item.count),
        fill: false,
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 flex items-center gap-4">
          <FaBookOpen className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-gray-500">Total Courses</p>
            <p className="text-2xl font-semibold">{coursesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 flex items-center gap-4">
          <FaEnvelope className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-gray-500">Messages</p>
            <p className="text-2xl font-semibold">{messagesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 flex items-center gap-4">
          <FaUsers className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-gray-500">Active Users</p>
            <p className="text-2xl font-semibold">{usersCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 flex items-center gap-4">
          <FaChartPie className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-gray-500">Unread Messages</p>
            <p className="text-2xl font-semibold">{messageStatus.unread}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartPie /> Message Status Distribution
          </h3>
          <Pie data={pieData} />
        </div>

        {/* User Registrations Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine /> New Users (Monthly)
          </h3>
          <Line data={lineUserData} />
        </div>

        {/* Course Additions Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine /> New Courses (Monthly)
          </h3>
          <Line data={lineCourseData} />
        </div>
      </div>

      {/* Main Grid: Latest Courses + Contact Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Added Courses */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Recently Added Courses</h3>
          </div>
          <div className="p-4">
            {latestCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No courses available</div>
            ) : (
              <ul className="space-y-4">
                {latestCourses.map((course) => (
                  <li
                    key={course._id}
                    className="flex space-x-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="w-28 h-28 overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={`http://localhost:9000/image/${course.image}`}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-gray-800">{course.name}</h4>
                        <span className="text-blue-600 font-bold">Rs {course.discountPrice}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Instructor: {course.instructor}</p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.category || "General"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {course.level || "All Levels"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 text-right">
            <a
              href="/admin/courses"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all courses →
            </a>
          </div>
        </div>

        {/* Contact Messages */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Recent Messages</h3>
          </div>
          <div className="p-4">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No messages available</div>
            ) : (
              <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {contacts.map(({ _id, fullName, email, course, message, phone }) => (
                  <li
                    key={_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{fullName}</h4>
                        <p className="text-sm text-gray-600">{email}</p>
                        <p className="text-sm text-gray-600">Number: {phone}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {course || "General Inquiry"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                        {message}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => deleteContact(_id)}
                        className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaTrashAlt className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
