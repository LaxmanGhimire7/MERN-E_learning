import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { AuthContext } from "../Context/AuthProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

function AdminHome() {
  const [latestCourses, setLatestCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { state } = useContext(AuthContext);

  // Fetch latest courses
  const getCourses = async () => {
    try {
      let res = await fetch("http://localhost:9000/api/course/getAllCourse");
      let data = await res.json();
      const latest = data.response.slice(-5).reverse();
      setLatestCourses(latest);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all contact messages
  const getContacts = async () => {
  try {
    let response = await fetch("http://localhost:9000/api/contact/getAllContacts");
    if (!response.ok) throw new Error("Failed to fetch contacts");
    let data = await response.json();
    console.log("Contact API data:", data);
    // Adjust according to actual structure
    setContacts(data.response || data.contacts || data || []);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load contact messages");
  }
};


  // Delete contact message by ID
  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      let response = await fetch(`http://localhost:9000/api/contact/deleteContact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Message deleted successfully");
      // Refresh contacts list
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  useEffect(() => {
    getCourses();
    getContacts();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-gray-100 min-h-screen">
      {/* Recently Added Courses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recently Added Courses</h3>
        {latestCourses.length === 0 ? (
          <p className="text-gray-500">No courses available.</p>
        ) : (
          <ul className="space-y-3">
            {latestCourses.map((course) => (
              <li key={course._id} className="border-b pb-3 last:border-none">
                <div className="font-medium text-gray-900">{course.name}</div>
                <div className="text-sm text-gray-600">Instructor: {course.instructor}</div>
                <div className="text-sm text-gray-600">Price: Rs {course.discountPrice}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Contact Messages */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Messages</h3>
        {contacts.length === 0 ? (
          <p className="text-gray-500">No contact messages found.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {contacts.map(({ _id, fullName, email, course, message }) => (
              <li
                key={_id}
                className="border border-gray-300 rounded-md p-4 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div className="mb-3 md:mb-0">
                  <p>
                    <span className="font-semibold">Name:</span> {fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {email}
                  </p>
                  <p>
                    <span className="font-semibold">Course:</span> {course}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">
                    <span className="font-semibold">Message:</span> {message}
                  </p>
                </div>
                <button
                  onClick={() => deleteContact(_id)}
                  className="self-start md:self-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  aria-label={`Delete message from ${fullName}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
