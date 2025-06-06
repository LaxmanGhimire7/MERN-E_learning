import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartProvider";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

function AddCourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const originalCourse = location.state;
  const [isEditing, setIsEditing] = useState(false);
  const [course, setCourse] = useState({ ...originalCourse });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatYouWillLearnChange = (section, index, value) => {
    setCourse((prev) => {
      const updated = [...prev.whatYouWillLearn[section]];
      updated[index] = value;
      return {
        ...prev,
        whatYouWillLearn: {
          ...prev.whatYouWillLearn,
          [section]: updated,
        },
      };
    });
  };

  const addNewPoint = (section) => {
    setCourse((prev) => ({
      ...prev,
      whatYouWillLearn: {
        ...prev.whatYouWillLearn,
        [section]: [...(prev.whatYouWillLearn?.[section] || []), ""],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Course:", course);
    // Add API call here to update course in DB if needed
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      {!isEditing ? (
        <>
          <div className="flex text-amber-400 mb-2">
            {Array.from({ length: 5 }, (_, i) => {
              const r = course?.rating || 0;
              if (r >= i + 1) return <FaStar key={i} className="w-5 h-5" />;
              else if (r >= i + 0.5)
                return <FaStarHalfAlt key={i} className="w-5 h-5" />;
              else return <FaRegStar key={i} className="w-5 h-5 text-gray-200" />;
            })}
          </div>

          <h1 className="text-xl font-bold">{course?.name}</h1>
          <p className="text-sm text-gray-600">Instructor: {course?.instructor}</p>
          <p className="text-sm text-gray-600">Category: {course?.categories}</p>

          <div className="my-4">
            <img
              className="h-56z w-56 object-cover rounded"
              src={`http://localhost:9000/image/${course?.image}`}
              alt={course?.name}
            />
          </div>

          <p>Duration: {course?.duration}</p>
          <p>Period: {course?.period}</p>
          <p>Requirement: {course?.requirement}</p>
          <p>Overview: {course?.overview}</p>
          <p>Demands & Scopes: {course?.demandsAndScopes}</p>
          <p>Opportunities: {course?.opportunities}</p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">What You Will Learn</h2>

            {course?.whatYouWillLearn?.section1Points?.length > 0 && (
              <div className="mb-2">
                <h3 className="font-medium">Section 1:</h3>
                <ul className="list-disc list-inside">
                  {course.whatYouWillLearn.section1Points.map((point, idx) => (
                    <li key={`s1-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {course?.whatYouWillLearn?.section2Points?.length > 0 && (
              <div className="mb-2">
                <h3 className="font-medium">Section 2:</h3>
                <ul className="list-disc list-inside">
                  {course.whatYouWillLearn.section2Points.map((point, idx) => (
                    <li key={`s2-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Course
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleChange}
            placeholder="Course Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="instructor"
            value={course.instructor}
            onChange={handleChange}
            placeholder="Instructor"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="categories"
            value={course.categories}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            placeholder="Duration"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="period"
            value={course.period}
            onChange={handleChange}
            placeholder="Period"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="requirement"
            value={course.requirement}
            onChange={handleChange}
            placeholder="Requirement"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="overview"
            value={course.overview}
            onChange={handleChange}
            placeholder="Overview"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="demandsAndScopes"
            value={course.demandsAndScopes}
            onChange={handleChange}
            placeholder="Demands & Scopes"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="opportunities"
            value={course.opportunities}
            onChange={handleChange}
            placeholder="Opportunities"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Edit Sections */}
          <div>
            <h3 className="font-medium mb-2">Section 1 Points</h3>
            {course?.whatYouWillLearn?.section1Points?.map((point, idx) => (
              <input
                key={`edit-s1-${idx}`}
                type="text"
                value={point}
                onChange={(e) =>
                  handleWhatYouWillLearnChange("section1Points", idx, e.target.value)
                }
                className="w-full mb-2 border px-2 py-1 rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => addNewPoint("section1Points")}
              className="text-blue-600 text-sm"
            >
              + Add Section 1 Point
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Section 2 Points</h3>
            {course?.whatYouWillLearn?.section2Points?.map((point, idx) => (
              <input
                key={`edit-s2-${idx}`}
                type="text"
                value={point}
                onChange={(e) =>
                  handleWhatYouWillLearnChange("section2Points", idx, e.target.value)
                }
                className="w-full mb-2 border px-2 py-1 rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => addNewPoint("section2Points")}
              className="text-blue-600 text-sm"
            >
              + Add Section 2 Point
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setCourse(originalCourse);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddCourseDetails;
