import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider"; 

function AddTestimonial() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: "",
    message: "",
    image: null,
  });


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/course/getAllCourse"); 
        const data = await res.json();
        if (res.ok) setCourses(data.response || data.courses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.message) {
      return toast.error("Please fill all required fields");
    }

    const token = state?.user?.token; 

    const body = new FormData();
    body.append("course", formData.course);
    body.append("message", formData.message);
    if (formData.image) body.append("image", formData.image);

    try {
      const res = await fetch("http://localhost:9000/api/testimonial/addTestimonial", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Testimonial submitted! Awaiting approval.");
        setFormData({ course: "", message: "", image: null });
      } else {
        toast.error(data.msg || "Failed to submit testimonial");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

 if (!user || user.role !== "student") {
  return <p>Login as a student to add a testimonial</p>;
}


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Testimonial</h2>

      <label className="block mb-2">
        Course
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id || course._id} value={course.id || course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        Message
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          rows={4}
          required
        />
      </label>

      <label className="block mb-4">
        Upload Image (optional)
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}

export default AddTestimonial;
