import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

function CreateAssignment() {
  const { state } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assignToAll, setAssignToAll] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchAllCourses, setFetchAllCourses] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState(0);

  // Fetch courses (instructor or all)
  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = fetchAllCourses
      ? "http://localhost:9000/api/course/getAllCourse"
      : "http://localhost:9000/api/course/instructor-courses";

    const options = fetchAllCourses
      ? { method: "GET" }
      : {
          method: "GET",
          headers: { Authorization: `Bearer ${state.token}` },
        };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setCourses(data.response || []);
          setError(null);
        } else {
          setCourses([]);
          setError(data.msg || "Failed to load courses");
        }
        setLoading(false);
      })
      .catch((err) => {
        setCourses([]);
        setError("Failed to load courses");
        setLoading(false);
        console.error(err);
      });
  }, [state.token, fetchAllCourses]);

  // Fetch enrolled students count when course changes
  useEffect(() => {
    if (!courseId || assignToAll) return;

    fetch(`http://localhost:9000/api/enrollments/count/${courseId}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    })
      .then((res) => res.json())
      .then((data) => setEnrolledStudents(data.count || 0))
      .catch(() => setEnrolledStudents(0));
  }, [courseId, assignToAll, state.token]);

  const submitForm = async (e) => {
    e.preventDefault();

    if (!assignToAll && enrolledStudents === 0) {
      alert("⚠️ No enrolled students found for selected course.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("courseId", courseId);
    formData.append("assignToAll", assignToAll);
    if (attachment) formData.append("attachment", attachment);

    try {
      const res = await fetch("http://localhost:9000/api/assignment/createAssignment", {
        method: "POST",
        headers: { Authorization: `Bearer ${state.token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Something went wrong");
      alert("✅ Assignment Created Successfully");
      setTitle("");
      setDescription("");
      setDueDate("");
      setCourseId("");
      setAssignToAll(true);
      setAttachment(null);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="flex justify-center py-8 bg-gray-50 min-h-screen">
      <form
        onSubmit={submitForm}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl flex flex-col gap-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Create Assignment
        </h2>

        <label className="inline-flex items-center space-x-3 cursor-pointer select-none self-start">
          <input
            type="checkbox"
            checked={fetchAllCourses}
            onChange={() => setFetchAllCourses((prev) => !prev)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 font-medium text-sm">
            Show all courses (not just mine)
          </span>
        </label>

        {error && <p className="text-red-600 font-medium text-center">{error}</p>}
        {loading && <p className="text-gray-500 font-medium text-center">Loading courses...</p>}

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
              type="text"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="flex-1 flex flex-col mt-6 md:mt-0">
            <label className="mb-2 font-semibold text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
              type="datetime-local"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 resize-none min-h-[100px]"
            placeholder="Enter assignment description"
          />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 items-center">
          <div className="flex-1 flex flex-col w-full">
            <label className="mb-2 font-semibold text-gray-700">
              Select Course <span className="text-red-500">*</span>
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3"
              required
              disabled={loading || courses.length === 0}
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center space-x-3 mt-6 md:mt-0">
            <input
              type="checkbox"
              checked={assignToAll}
              onChange={(e) => setAssignToAll(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium whitespace-nowrap">
              Assign to all enrolled students
            </span>
          </label>
        </div>

        {/* Conditional warning if "Assign to All" is unchecked and no students */}
        {!assignToAll && courseId && enrolledStudents === 0 && (
          <p className="text-yellow-600 font-medium text-sm mt-1">
            ⚠️ No enrolled students in selected course.
          </p>
        )}

        <div className="flex flex-col w-full">
          <label className="mb-2 font-semibold text-gray-700">
            Attachment (PDF / Word)
          </label>
          <input
            onChange={(e) => setAttachment(e.target.files[0])}
            className="border border-gray-300 rounded-lg px-4 py-3"
            type="file"
            accept=".pdf,.doc,.docx"
          />
        </div>

        <button
          type="submit"
          disabled={loading || courses.length === 0}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading || courses.length === 0
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
}

export default CreateAssignment;
