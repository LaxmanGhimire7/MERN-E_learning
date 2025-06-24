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
      console.log(data)
      setCourses(data.enrolledCourses || []);
    } catch (err) {
      console.error("Error fetching student dashboard:", err);
    }
  };

  useEffect(() => {
    getStudentInfo();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Dashboard</h2>
      <div className="space-y-4 flex gap-5 flex-wrap w-72">
        {courses.length === 0 ? (
          <p>You are not enrolled in any courses yet here.</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="p-4 border rounded shadow bg-white">
              <h3 className="font-semibold text-lg">{course.name}</h3>
              <p>Progress: { course.progress}%</p>
              {course.certificateUrl && (
                <a href={course.certificateUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                  View Certificate
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentHome;
