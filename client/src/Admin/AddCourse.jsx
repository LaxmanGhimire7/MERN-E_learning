import { useState } from "react";
import {
  BookOpenIcon,
  UserCircleIcon,
  StarIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TagIcon,
  PhotoIcon,
  CheckBadgeIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddCourse() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [fields, setFields] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);

  // Available field/category options
  const fieldOptions = [
    "Development",
    "App Development",
    "Design",
    "Data Science",
    "AI",
    "Digital Marketing",
    "DevOps",
    "Machine Learning",
    "Cloud Computing",
    "Cybersecurity",
    "QA Testing",
    "Project Management",
  ];

  const formSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("instructor", instructor);
    formData.append("rating", rating);
    formData.append("duration", duration);
    formData.append("fields", fields);
    formData.append("isBestseller", isBestseller);
    formData.append("isFeatured", isFeatured);
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://localhost:9000/api/course/createCourse",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.msg || "Failed to create course");
        return;
      }

      toast.success("Course created successfully!");
      navigate("/dashboard/course");
    } catch (error) {
      toast.error("Something went wrong: " + error.message);
    }
  };

  return (
    <div className="p-10 ml-52 mt-8 bg-white rounded-xl shadow-lg border border-blue-50">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-800 flex items-center justify-center gap-2">
          <BookOpenIcon className="h-8 w-8 text-blue-600" />
          Add New Course
        </h2>
        <p className="text-gray-600 mt-2">
          Fill in the details to create a new course
        </p>
      </div>

      <form onSubmit={formSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-6">
          {/* Left Column */}
          <div className="flex-1 min-w-[300px] space-y-6">
            {/* Course Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <BookOpenIcon className="h-5 w-5 text-blue-600" />
                Course Name
              </label>
              <input
                type="text"
                required
                placeholder="Add Course Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Instructor */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <UserCircleIcon className="h-5 w-5 text-blue-600" />
                Instructor Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter Instructor Name"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <StarIcon className="h-5 w-5 text-blue-600" />
                Rating (0–5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                required
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <ClockIcon className="h-5 w-5 text-blue-600" />
                Duration
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 10 hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Course Category / Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <TagIcon className="h-5 w-5 text-blue-600" />
                Course Field
              </label>
              <select
                value={fields}
                onChange={(e) => setFields(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option>
                  -- Select Field --
                </option>
                {fieldOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 min-w-[300px] space-y-6">
            {/* Original Price */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <CurrencyRupeeIcon className="h-5 w-5 text-blue-600" />
                Original Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Discount Price */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <TagIcon className="h-5 w-5 text-blue-600" />
                Discount Price
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Course Thumbnail */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-blue-800 gap-2">
                <PhotoIcon className="h-5 w-5 text-blue-600" />
                Course Thumbnail
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1 text-sm font-medium text-blue-800">
                  <FireIcon className="h-5 w-5 text-orange-500" />
                  Bestseller
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1 text-sm font-medium text-blue-800">
                  <CheckBadgeIcon className="h-5 w-5 text-green-500" />
                  Featured Course
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <BookOpenIcon className="h-5 w-5" />
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCourse;
