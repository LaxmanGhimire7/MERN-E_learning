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
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        👋 Welcome to Your Student Dashboard
      </h2>

      {courses.length === 0 ? (
        <div className="text-center bg-white p-6 rounded-lg shadow-md text-gray-600 max-w-md mx-auto">
          <p className="text-lg font-medium">You are not enrolled in any courses yet.</p>
          <p className="text-sm mt-2">Explore available courses and start learning today!</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="w-[280px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2 line-clamp-2">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">Progress: {course.progress}%</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {course.certificateUrl && (
                <a
                  href={course.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-block text-center bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded transition"
                >
                  🎓 View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentHome;
