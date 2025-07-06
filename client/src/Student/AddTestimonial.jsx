import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";
import { FaUserGraduate, FaUpload, FaInfoCircle, FaSpinner } from "react-icons/fa";
import { MdOutlineImage, MdContactSupport } from "react-icons/md";

function AddTestimonial() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: "",
    message: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/course/getAllCourse");
        const data = await res.json();
        if (res.ok) setCourses(data.response || data.courses);
      } catch (error) {
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.message) {
      return toast.error("Please fill all required fields");
    }

    setIsSubmitting(true);
    const body = new FormData();
    body.append("course", formData.course);
    body.append("message", formData.message);
    if (formData.image) body.append("image", formData.image);

    try {
      const res = await fetch("http://localhost:9000/api/testimonial/addTestimonial", {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Testimonial submitted!");
        setFormData({ course: "", message: "", image: null });
        setPreviewImage(null);
      } else toast.error(data.msg || "Failed to submit testimonial");
    } catch (error) {
      toast.error("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <FaUserGraduate className="text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600 mb-4">Please log in as a student to submit testimonials.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const selectedCourse = courses.find(
    (c) => c._id === formData.course || c.id === formData.course
  );

  return (
    <div className="min-h-screen ml-24 py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="md:flex">
          {/* Left: Form */}
          <div className="md:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Experience</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-1 font-medium text-gray-700">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="block mb-1 font-medium text-gray-700">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your learning journey..."
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1 font-medium text-gray-700">Upload Image</label>
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <MdOutlineImage className="text-4xl text-gray-400" />
                  <p className="text-sm text-gray-500">
                    <strong>Click to upload</strong> or drag & drop
                  </p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" /> Submitting...
                  </span>
                ) : (
                  "Submit Testimonial"
                )}
              </button>
            </form>
          </div>

          {/* Right: Preview */}
          <div className="md:w-1/3 bg-indigo-50 p-8 border-t md:border-t-0 md:border-l border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Live Preview</h3>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center space-x-4 mb-4">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200" />
                )}
                <div>
                  <p className="font-bold text-gray-700">{user?.name || "Student"}</p>
                  <p className="text-sm text-gray-500">Learner</p>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500">Course:</p>
                <p className="font-medium">{selectedCourse?.name || "Not selected"}</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-3 italic text-sm text-gray-700">
                {formData.message ? (
                  `"${formData.message.substring(0, 120)}${formData.message.length > 120 ? "..." : ""}"`
                ) : (
                  <span className="text-gray-400">Your testimonial preview will appear here</span>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-start text-sm text-blue-800 bg-blue-100 p-4 rounded-xl">
              <FaInfoCircle className="mr-2 mt-0.5" />
              <p>Your testimonial will be reviewed by our team before being published publicly.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddTestimonial;
