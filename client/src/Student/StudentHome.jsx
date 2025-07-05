import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";

function StudentHome() {
  const { state } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  const getStudentInfo = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/student/getStudentDashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch dashboard", res.status);
        return;
      }

      const data = await res.json();
      setCourses(data.enrolledCourses || []);
    } catch (err) {
      console.error("Error fetching student dashboard:", err);
    }
  };

  useEffect(() => {
    getStudentInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white px-4 sm:px-10 py-12">
      <h2 className="text-4xl font-extrabold text-blue-900 text-center mb-10">
        🎓 Welcome to Your Student Dashboard
      </h2>

      {courses.length === 0 ? (
        <div className="max-w-lg mx-auto text-center bg-white shadow-md rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Courses Enrolled</h3>
          <p className="text-sm text-gray-500">
            Looks like you haven't enrolled in any courses yet. Start your learning journey today!
          </p>
          <a
            href="/courses"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-5 rounded-md transition"
          >
            📚 Browse Courses
          </a>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="w-full max-w-sm bg-white rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col"
            >
              {/* Image */}
              {course.image && (
                <img
                  src={`http://localhost:9000/image/${course.image}`}
                  alt={course.name}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Course Title */}
                <h3 className="text-xl font-semibold text-blue-800 mb-2 line-clamp-2">
                  {course.name}
                </h3>

                {/* Progress Info */}
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-medium">Progress:</span> {course.progress}%
                </p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                {/* Enrollment Date (optional) */}
                {course.enrolledDate && (
                  <p className="text-xs text-gray-400 mb-4">
                    Enrolled on: {new Date(course.enrolledDate).toLocaleDateString()}
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-auto flex flex-col gap-2">
                  <a
                    href={`/courses/${course._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium text-center py-2 px-4 rounded-md transition"
                  >
                    🚀 Continue Learning
                  </a>

                  {course.certificateUrl ? (
                    <a
                      href={course.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium text-center py-2 px-4 rounded-md transition"
                    >
                      🎖️ View Certificate
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 text-center">
                      Certificate not available
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentHome;
