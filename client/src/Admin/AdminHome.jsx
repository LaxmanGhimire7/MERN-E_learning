import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaBook, FaEnvelope, FaUsers, FaTrash, FaChartBar, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../Context/AuthProvider";

function AdminHome() {
  const [latestCourses, setLatestCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    courses: 124,
    messages: 42,
    users: 856,
    revenue: 12480
  });
  
  const { state } = useContext(AuthContext);


  useEffect(() => {

    setTimeout(() => {
      setLatestCourses([
        { _id: 1, name: "Advanced React Patterns", instructor: "Alex Johnson", discountPrice: 1299, category: "Web Development" },
        { _id: 2, name: "UI/UX Design Fundamentals", instructor: "Sarah Williams", discountPrice: 999, category: "Design" },
        { _id: 3, name: "Data Science Essentials", instructor: "Michael Chen", discountPrice: 1499, category: "Data Science" },
        { _id: 4, name: "Mobile App Development", instructor: "David Kim", discountPrice: 1199, category: "Mobile" },
        { _id: 5, name: "Cloud Infrastructure", instructor: "Emily Rodriguez", discountPrice: 1599, category: "DevOps" }
      ]);
      
      setContacts([
        { _id: 1, fullName: "John Smith", email: "john@example.com", course: "React Mastery", message: "I'm interested in the advanced topics. When will the next batch start?" },
        { _id: 2, fullName: "Emma Davis", email: "emma@company.com", course: "UI/UX Design", message: "Could you provide more information about the design tools covered in the course?" },
        { _id: 3, fullName: "Robert Johnson", email: "robertj@gmail.com", course: "Data Science", message: "Do I need prior experience in statistics for this course?" },
        { _id: 4, fullName: "Sophia Martinez", email: "sophia.m@outlook.com", course: "Cloud Infrastructure", message: "Will there be hands-on labs with AWS?" }
      ]);
    }, 800);
  }, []);

  const deleteContact = (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    setContacts(prev => prev.filter(contact => contact._id !== id));
    toast.success("Message deleted successfully");
    setStats(prev => ({ ...prev, messages: prev.messages - 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {state.user?.name || "Admin"}! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex items-center border-l-4 border-blue-500">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <FaBook className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Courses</p>
            <h3 className="text-2xl font-bold">{stats.courses}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center border-l-4 border-green-500">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <FaEnvelope className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Messages</p>
            <h3 className="text-2xl font-bold">{stats.messages}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center border-l-4 border-purple-500">
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <FaUsers className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <h3 className="text-2xl font-bold">{stats.users}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center border-l-4 border-amber-500">
          <div className="bg-amber-100 p-3 rounded-lg mr-4">
            <FaChartBar className="text-amber-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Revenue (Rs)</p>
            <h3 className="text-2xl font-bold">{stats.revenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Added Courses */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Recently Added Courses</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
              View all
            </button>
          </div>
          <div className="p-4">
            {latestCourses.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <FaBook className="text-gray-400 text-2xl" />
                </div>
                <p className="mt-4 text-gray-500">No courses available</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {latestCourses.map((course) => (
                  <li key={course._id} className="py-4 flex items-start">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 truncate">{course.name}</h4>
                        <span className="font-semibold text-blue-600 whitespace-nowrap ml-2">Rs {course.discountPrice}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">Instructor: {course.instructor}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.category}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <p className="text-gray-500 text-sm">Showing 5 of {stats.courses} courses</p>
            <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              See all courses <FaChevronRight className="ml-1 text-xs" />
            </button>
          </div>
        </div>

        {/* Contact Messages */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Recent Messages</h3>
          </div>
          <div className="p-4">
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <FaEnvelope className="text-gray-400 text-2xl" />
                </div>
                <p className="mt-4 text-gray-500">No messages available</p>
              </div>
            ) : (
              <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {contacts.map(({ _id, fullName, email, course, message }) => (
                  <li
                    key={_id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between">
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{fullName}</h4>
                        <p className="text-sm text-gray-600 truncate">{email}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 whitespace-nowrap ml-2">
                        {course}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">
                        {message}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => deleteContact(_id)}
                        className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <p className="text-gray-500 text-sm">Showing {contacts.length} of {stats.messages} messages</p>
            <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              View all messages <FaChevronRight className="ml-1 text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-md mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="flex items-end h-64">
            <div className="flex-1 flex justify-around items-end">
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "120px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Mon</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "180px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Tue</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "150px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Wed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "200px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Thu</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "170px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Fri</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "140px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Sat</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "160px" }}></div>
                <span className="mt-2 text-xs text-gray-500">Sun</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center mr-6">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Course Views</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">User Signups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;