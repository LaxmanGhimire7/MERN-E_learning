import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { FaGraduationCap, FaBookOpen, FaPlayCircle, FaAward } from "react-icons/fa";

function StudentHome() {
  const { state } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStudentInfo = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/student/getStudentDashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch dashboard", res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCourses(data.enrolledCourses || []);
    } catch (err) {
      console.error("Error fetching student dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-blue-600 text-xl font-semibold animate-pulse">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white px-6 sm:px-12 py-16">
      <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-12 select-none flex items-center justify-center gap-3">
        <FaGraduationCap className="text-blue-700" /> Welcome to Your Student Dashboard
      </h2>

      {courses.length === 0 ? (
        <section className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
            No Courses Enrolled <FaBookOpen className="text-gray-500" />
          </h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Looks like you haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <a
            href="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-base py-3 px-7 rounded-lg transition-shadow shadow-md hover:shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Browse courses"
          >
            <FaBookOpen className="inline mr-2" /> Browse Courses
          </a>
        </section>
      ) : (
        <div className="flex flex-wrap justify-center gap-10">
          {courses.map((course) => (
            <article
              key={course._id}
              className="w-full max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              aria-label={`Course: ${course.name}`}
            >
              {course.image && (
                <img
                  src={`http://localhost:9000/image/${course.image}`}
                  alt={course.name}
                  className="w-full h-44 object-cover rounded-t-2xl"
                  loading="lazy"
                />
              )}

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-blue-900 mb-3 line-clamp-2">{course.name}</h3>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 font-medium mb-1">Progress:</p>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700"
                      style={{ width: `${course.progress}%` }}
                      aria-valuenow={course.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      role="progressbar"
                    ></div>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1 font-mono">{course.progress}% completed</p>
                </div>

                {course.enrolledDate && (
                  <p className="text-xs text-gray-400 mb-6 italic">
                    Enrolled on: {new Date(course.enrolledDate).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={`/courses/${course._id}`}
                    className=" bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-semibold py-3 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center gap-2"
                    aria-label={`Continue learning course ${course.name}`}
                  >
                    <FaPlayCircle /> Continue Learning
                  </a>

                  {course.certificateUrl ? (
                    <a
                      href={course.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" bg-green-600 hover:bg-green-700 text-white text-center text-sm font-semibold py-3 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 flex justify-center items-center gap-2"
                      aria-label={`View certificate for course ${course.name}`}
                    >
                      <FaAward /> View Certificate
                    </a>
                  ) : (
                    <p className="text-center text-xs text-gray-400 italic select-none">
                      Certificate not available yet
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentHome;
