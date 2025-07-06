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
  FaEye
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
import { NavLink } from "react-router-dom";

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
  const [userStats, setUserStats] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [messageStatus, setMessageStatus] = useState({ read: 0, unread: 0 });

  const { state } = useContext(AuthContext);

  const getCourses = async () => {
    try {
      let res = await fetch("http://localhost:9000/api/course/getAllCourse");
      let data = await res.json();
      const latest = data.response.slice(-5).reverse();
      setLatestCourses(latest);
      setCoursesCount(data.response.length);
    } catch (err) {
      console.error(err);
    }
  };

  const getContacts = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/contact/getAllContacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      let data = await response.json();
      const msgs = data.response || data.contacts || data || [];
      setContacts(msgs);
      setMessagesCount(msgs.length);
      const readCount = msgs.filter((m) => m.read).length;
      setMessageStatus({ read: readCount, unread: msgs.length - readCount });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contact messages");
    }
  };

  const getUserStats = async () => {
    try {
      let res = await fetch("http://localhost:9000/api/user/stats");
      if (!res.ok) throw new Error("Failed to fetch user stats");
      let data = await res.json();
      setUserStats(data.stats || []);
      const totalUsers = data.stats.reduce((acc, cur) => acc + cur.count, 0);
      setUsersCount(totalUsers);
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Insight into your platform’s performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[{
          icon: <FaBookOpen className="text-blue-500" />, label: "Total Courses", count: coursesCount, color: "blue"
        }, {
          icon: <FaEnvelope className="text-green-500" />, label: "Messages", count: messagesCount, color: "green"
        }, {
          icon: <FaUsers className="text-purple-500" />, label: "Active Users", count: usersCount, color: "purple"
        }, {
          icon: <FaChartPie className="text-yellow-500" />, label: "Unread Messages", count: messageStatus.unread, color: "yellow"
        }].map(({ icon, label, count, color }, i) => (
          <div
            key={i}
            className={`bg-white shadow-xl p-6 rounded-xl border-l-8 border-${color}-500 flex gap-4 items-center`}
          >
            <div className="text-3xl">{icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="text-xl font-bold">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartPie /> Message Distribution
          </h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartLine /> User Growth
          </h3>
          <Line data={lineUserData} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartLine /> Course Additions
          </h3>
          <Line data={lineCourseData} />
        </div>
      </div>

      {/* Latest Courses & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Courses */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">Latest Courses</h3>
          </div>
          <ul className="p-4 space-y-4">
            {latestCourses.length ? latestCourses.map((course) => (
              <li key={course._id} className="flex items-start gap-4 border rounded-md p-3">
                <img
                  src={`http://localhost:9000/image/${course.image}`}
                  alt={course.name}
                  className="w-20 h-20 rounded object-cover border"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-700">{course.name}</h4>
                    <span className="text-blue-600 font-bold">Rs {course.discountPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                  <div className="mt-1 flex gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{course.category}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{course.level}</span>
                  </div>
                </div>
              </li>
            )) : <p className="text-center text-sm text-gray-500">No recent courses</p>}
          </ul>
          <div className="border-t px-6 py-3 text-right bg-gray-50">
            <NavLink to="/admin/courses" className="text-blue-600 text-sm hover:underline">
              View all courses <FaEye className="inline ml-1" />
            </NavLink>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">Latest Messages</h3>
          </div>
          <ul className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {contacts.length ? contacts.map(({ _id, fullName, email, course, message, phone }) => (
              <li key={_id} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{fullName}</h4>
                    <p className="text-sm text-gray-600">{email} | {phone}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">{course}</span>
                </div>
                <p className="mt-2 text-gray-700 text-sm bg-gray-50 p-2 rounded-md whitespace-pre-wrap">{message}</p>
                <div className="text-right mt-2">
                  <button
                    onClick={() => deleteContact(_id)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </li>
            )) : <p className="text-sm text-gray-500 text-center">No messages available</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
