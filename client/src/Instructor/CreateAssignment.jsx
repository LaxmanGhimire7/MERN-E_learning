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
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses (all or instructor's)
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

  // Fetch enrolled students only when a course is selected and assignToAll is false
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
      alert(" No enrolled students found for the selected course.");
      return;
    }

    if (!window.confirm("Are you sure you want to create this assignment?"))
      return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("courseId", courseId);
    formData.append("assignToAll", assignToAll);
    if (attachment) formData.append("attachment", attachment);

    try {
      setSubmitting(true);
      const res = await fetch(
        "http://localhost:9000/api/assignment/createAssignment",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${state.token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Something went wrong");

      alert("✅ Assignment created successfully!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setCourseId("");
      setAssignToAll(true);
      setAttachment(null);
      setEnrolledStudents([]);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <form
        onSubmit={submitForm}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl flex flex-col gap-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Assignment
        </h2>

        {/* Toggle for showing all courses */}
        <label className="flex items-center space-x-3 self-start">
          <input
            type="checkbox"
            checked={fetchAllCourses}
            onChange={() => setFetchAllCourses((prev) => !prev)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm text-gray-700">
            Show all courses (not just mine)
          </span>
        </label>

        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}
        {loading && (
          <p className="text-gray-500 text-center">Loading courses...</p>
        )}

        {/* Title and Due Date */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="font-semibold text-gray-700">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-lg"
              required
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold text-gray-700">Due Date *</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-lg"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-4 py-3 border rounded-lg resize-none min-h-[100px]"
            placeholder="Enter assignment description"
          />
        </div>

        {/* Course selection and assignToAll checkbox */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full">
            <label className="font-semibold text-gray-700">
              Select Course *
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-lg"
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center space-x-2 mt-2 md:mt-7">
            <input
              type="checkbox"
              checked={assignToAll}
              onChange={(e) => setAssignToAll(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium">
              Assign to all enrolled students
            </span>
          </label>
        </div>

        {/* Show enrolled students list if assignToAll is false */}
        {/* Student preview (if assignToAll is false) */}
       

        {/* Warning if no enrolled students */}
        {!assignToAll && courseId && enrolledStudents.length === 0 && (
          <p className="text-yellow-600 font-medium text-sm">
            ⚠️ No enrolled students in the selected course.
          </p>
        )}

        {/* Attachment input */}
        <div>
          <label className="font-semibold text-gray-700">
            Attachment (PDF / DOC / DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="w-full mt-1 px-4 py-3 border rounded-lg"
          />
          {attachment && (
            <p className="text-sm mt-2 text-gray-600">
              📎 <strong>{attachment.name}</strong> (
              {(attachment.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || submitting}
          className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition ${
            loading || submitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
}

export default CreateAssignment;
