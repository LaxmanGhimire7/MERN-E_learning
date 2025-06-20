import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";

function StudentHome() {
  const {state} = useContext(AuthContext)
  const [courses, setCourses] = useState([]);

  useEffect(() => {

    fetch("http://localhost:9000/api/course/getCourse", {
      headers: { Authorization: `Bearer ${state.token}` },
    })
      .then(res => res.json())
      .then(data => setCourses(data.courses));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Dashboard</h2>
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course._id} className="p-4 border rounded shadow bg-white">
            <h3 className="font-semibold text-lg">{course.name}</h3>
            <p>Progress: {course.progress}%</p>
            {course.certificateUrl && (
              <a href={course.certificateUrl} target="_blank" className="text-blue-500 underline">
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default StudentHome;