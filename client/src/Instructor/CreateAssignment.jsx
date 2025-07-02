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

  const submitForm = async (e) => {
    e.preventDefault();

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

        {/* Toggle: Show all courses */}
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

        {error && (
          <p className="text-red-600 font-medium text-center">{error}</p>
        )}
        {loading && (
          <p className="text-gray-500 font-medium text-center">Loading courses...</p>
        )}

        {/* Title & Due Date side by side */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1 flex flex-col">
            <label htmlFor="title" className="mb-2 font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="flex-1 flex flex-col mt-6 md:mt-0">
            <label htmlFor="dueDate" className="mb-2 font-semibold text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="datetime-local"
              required
            />
          </div>
        </div>

        {/* Description full width */}
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 font-semibold text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
            placeholder="Enter assignment description"
          />
        </div>

        {/* Course select and assignToAll checkbox side by side */}
        <div className="flex flex-col md:flex-row md:space-x-6 items-center">
          <div className="flex-1 flex flex-col w-full">
            <label htmlFor="course" className="mb-2 font-semibold text-gray-700">
              Select Course <span className="text-red-500">*</span>
            </label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
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

        {/* Attachment */}
        <div className="flex flex-col w-full">
          <label htmlFor="attachment" className="mb-2 font-semibold text-gray-700">
            Attachment (PDF / Word)
          </label>
          <input
            id="attachment"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="file"
            accept=".pdf,.doc,.docx"
          />
        </div>

        {/* Submit button */}
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
