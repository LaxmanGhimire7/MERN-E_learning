import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Optional icon package
import { toast } from "react-toastify";

function EditCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    _id,
    name: courseName,
    instructor,
    rating,
    price,
    discountPrice,
    isBestseller,
    isFeatured,
    duration,
    image: courseImage,
    fields,
  } = location?.state;

  const [name, setName] = useState(courseName);
  const [instructorName, setInstructorName] = useState(instructor);
  const [courseRating, setCourseRating] = useState(rating);
  const [coursePrice, setCoursePrice] = useState(price);
  const [courseDiscountPrice, setCourseDiscountPrice] = useState(discountPrice);
  const [bestseller, setBestseller] = useState(isBestseller);
  const [featured, setFeatured] = useState(isFeatured);
  const [courseDuration, setCourseDuration] = useState(duration);
  const [field, setField] = useState(fields);
  const [image, setImage] = useState(null);

  const handleEditCourse = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("instructor", instructorName);
    formData.append("rating", courseRating);
    formData.append("price", coursePrice);
    formData.append("discountPrice", courseDiscountPrice);
    formData.append("isBestseller", bestseller === "true" || bestseller === true);
    formData.append("isFeatured", featured === "true" || featured === true);
    formData.append("duration", courseDuration || "Self-paced");
    formData.append("fields", field);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`http://localhost:9000/api/course/editCourse/${_id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      toast.success("Course Updated:", data);
      navigate("/dashboard/course");
    } catch (error) {
      toast.error("Failed to update course:", error);
    }
  };

  const handleCancelEdit = () => {
    navigate("/dashboard/course");
  };

  return (
    <div className="flex justify-center items-center ml-56 min-h-screen p-4">
      <form
        onSubmit={handleEditCourse}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        {/*Cancel/Close Button */}
        <button
          type="button"
          onClick={handleCancelEdit}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
          title="Cancel Editing"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 border-b pb-4">
          Edit Course Details
        </h2>

        {courseImage && (
          <div className="flex flex-col items-center">
            <img
              className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 mb-4"
              src={`http://localhost:9000/image/${courseImage}`}
              alt="Course"
            />
          </div>
        )}

        <div className="space-y-4">
          {/* Course Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full mt-1 text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructor</label>
            <input
              type="text"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Field</label>
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder="e.g., Development"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rating and Duration */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                type="number"
                step="0.1"
                value={courseRating}
                onChange={(e) => setCourseRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                placeholder="e.g., 10 hours or Self-paced"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Price and Discount Price */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Discount Price</label>
              <input
                type="number"
                value={courseDiscountPrice}
                onChange={(e) => setCourseDiscountPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bestseller and Featured */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Bestseller</label>
              <select
                value={bestseller}
                onChange={(e) => setBestseller(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Featured</label>
              <select
                value={featured}
                onChange={(e) => setFeatured(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}

export default EditCourse;
