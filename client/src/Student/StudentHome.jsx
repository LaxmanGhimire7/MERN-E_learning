import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import {
  FaGraduationCap,
  FaBookOpen,
  FaPlayCircle,
  FaAward,
} from "react-icons/fa";

function StudentHome() {
  const { state } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStudentInfo = async () => {
      try {
        const res = await fetch(
          "http://localhost:9000/api/student/getStudentDashboard",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch dashboard");

        const data = await res.json();
        setCourses(data.enrolledCourses || []);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    getStudentInfo();
  }, [state.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-blue-600 text-lg animate-pulse font-semibold">
          Loading your courses...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-6 py-16">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-900 flex justify-center items-center gap-3">
          <FaGraduationCap className="text-blue-700" /> Welcome to Your Student Dashboard
        </h1>
      </section>

      {courses.length === 0 ? (
        <section className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-700 flex items-center justify-center gap-2 mb-3">
            No Courses Enrolled <FaBookOpen className="text-gray-500" />
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <a
            href="/courses"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition shadow-md"
          >
            <FaBookOpen /> Browse Courses
          </a>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course) => (
            <article
              key={course._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              {course.image && (
                <img
                  src={`http://localhost:9000/image/${course.image}`}
                  alt={course.name}
                  className="w-full h-44 object-cover"
                />
              )}

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-blue-900 mb-2 line-clamp-2">
                  {course.name}
                </h3>

                <div className="mb-4">
                  <label className="text-sm text-gray-600 font-medium">Progress:</label>
                  <div className="w-full h-3 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-500 mt-1">
                    {course.progress}% completed
                  </p>
                </div>

                <p className="text-xs text-gray-400 italic mb-6">
                  Enrolled on: {new Date(course.enrolledDate).toLocaleDateString()}
                </p>

                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={`/courses/${course._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FaPlayCircle /> Continue Learning
                  </a>

                  {course.certificateUrl ? (
                    <a
                      href={course.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FaAward /> View Certificate
                    </a>
                  ) : (
                    <p className="text-center text-xs text-gray-400 italic">
                      Certificate not available yet
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default StudentHome;
