import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";

function CreateAssignment() {
  const { state } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assignToAll, setAssignToAll] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchAllCourses, setFetchAllCourses] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);


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
      .catch(() => {
        setCourses([]);
        setError("Failed to load courses");
        setLoading(false);
      });
  }, [state.token, fetchAllCourses]);

  // Fetch enrolled students
  useEffect(() => {
    if (!courseId || assignToAll) {
      setEnrolledStudents([]);
      return;
    }

    fetch(`http://localhost:9000/api/course/${courseId}/students`, {
      headers: { Authorization: `Bearer ${state.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.students) {
          setEnrolledStudents(data.students);
        } else {
          setEnrolledStudents([]);
        }
      })
      .catch(() => setEnrolledStudents([]));
  }, [courseId, assignToAll, state.token]);

  const submitForm = async (e) => {
    e.preventDefault();

    if (!assignToAll && enrolledStudents.length === 0) {
      alert("⚠️ No enrolled students found for the selected course.");
      return;
    }

    if (!window.confirm("Are you sure you want to create this assignment?")) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("courseId", courseId);
    formData.append("assignToAll", assignToAll);

    if (!assignToAll) {
      enrolledStudents.forEach((student) => {
        formData.append("assignTo[]", student._id);
      });
    }

    if (attachment) formData.append("attachment", attachment);

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:9000/api/assignment/createAssignment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Something went wrong");

      toast.success(" Assignment created successfully!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setCourseId("");
      setAssignToAll(true);
      setAttachment(null);
      setEnrolledStudents([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ml-36 flex items-center justify-center p-8">
      <form
        onSubmit={submitForm}
        className="bg-white max-w-3xl w-full rounded-3xl shadow-xl p-10 flex flex-col gap-8 border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6 select-none">
          Create Assignment
        </h2>

        
        <label className="inline-flex items-center space-x-3 self-start text-gray-700 font-semibold cursor-pointer select-none">
          <input
            type="checkbox"
            checked={fetchAllCourses}
            onChange={() => setFetchAllCourses((prev) => !prev)}
            className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
          />
          <span>Show all courses</span>
        </label>

        {error && (
          <p className="text-red-600 text-center font-medium bg-red-100 p-2 rounded select-none">
            {error}
          </p>
        )}
        {loading && (
          <p className="text-gray-500 text-center italic select-none">Loading courses...</p>
        )}

        {/* Title and Due Date */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold text-gray-800 select-none">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter assignment title"
              required
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold text-gray-800 select-none">Due Date *</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-800 select-none">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 resize-none min-h-[110px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter assignment description (optional)"
          />
        </div>

        {/* Course selection and assignToAll checkbox */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 flex flex-col">
            <label className="mb-2 font-semibold text-gray-800 select-none">Select Course *</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            >
              <option value="" disabled>
                -- Select Course --
              </option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center space-x-3 text-gray-700 font-semibold select-none cursor-pointer">
            <input
              type="checkbox"
              checked={assignToAll}
              onChange={(e) => setAssignToAll(e.target.checked)}
              className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
            />
            <span>Assign to all enrolled students</span>
          </label>
        </div>

        {/* Enrolled student preview */}
        {!assignToAll && enrolledStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg max-h-44 overflow-y-auto">
            <h3 className="font-semibold mb-2 text-blue-800 select-none">
              Enrolled Students ({enrolledStudents.length}):
            </h3>
            <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
              {enrolledStudents.map((student) => (
                <li key={student._id}>
                  {student.name} <span className="text-gray-400 text-xs">({student.email})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!assignToAll && courseId && enrolledStudents.length === 0 && (
          <p className="text-yellow-700 font-semibold text-sm select-none">
           No enrolled students in the selected course.
          </p>
        )}

        {/* Attachment input */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-800 select-none">
            Attachment (PDF / DOC / DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="border border-gray-300 rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {attachment && (
            <p className="text-sm mt-2 text-gray-600 select-text">
              📎 <strong>{attachment.name}</strong> ({(attachment.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || submitting}
          className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
            loading || submitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } shadow-lg hover:shadow-xl`}
        >
          {submitting ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
}

export default CreateAssignment;
