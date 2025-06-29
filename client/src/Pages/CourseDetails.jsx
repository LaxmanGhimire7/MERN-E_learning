import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartProvider";
import {
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const item = location?.state;

  const [expandedLearn, setExpandedLearn] = useState({
    section1: true,
    section2: false,
  });

  const toggleLearnSection = (section) => {
    setExpandedLearn((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="p-6 bg-white">
      <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Left Side Image */}
          <div className="md:w-2/3 p-4">
            <img
              className="w-full h-auto object-cover rounded"
              src={`http://localhost:9000/image/${item.image}`}
              alt={item.name}
            />
          </div>

          {/* Right Info */}
          <div className="md:w-1/3 p-4 flex flex-col justify-between">
            <div>
              <p className="text-gray-800 text-2xl font-semibold mb-2">
                Rs.{item.price} <span className="line-through text-gray-400 ml-2 text-base">Rs.{item.discountPrice}</span>
              </p>

              <button
                onClick={() => {
                  dispatch({
                    type: "AddToCart",
                    payload: item,
                  });
                }}
                className="bg-blue-700 text-white py-2 px-4 rounded-lg w-full text-center hover:bg-blue-800 mb-4"
              >
                Add to cart
              </button>

              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>Category:</strong> {item.fields}</li>
                <li><strong>Level:</strong> {item.categories}</li>
                <li><strong>Duration:</strong> {item.duration}</li>
                <li><strong>Last Updated:</strong> {new Date(item.updatedAt).toLocaleDateString()}</li>
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-400">A course by</p>
              <p className="text-sm font-semibold text-gray-800">{item.instructor}</p>
            </div>
          </div>
        </div>

        {/* Title & Rating */}
        <div className="bg-gray-100 p-4 border-t">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{item.name}</h1>
          <div className="flex items-center text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => {
              const r = item.rating;
              if (r >= i + 1) return <FaStar key={i} className="w-5 h-5" />;
              else if (r >= i + 0.5)
                return <FaStarHalfAlt key={i} className="w-5 h-5" />;
              else
                return <FaRegStar key={i} className="w-5 h-5 text-gray-300" />;
            })}
          </div>
        </div>

        {/* Course Description */}
        <div className="p-4 text-sm text-gray-700 space-y-2">
          <p><strong>Requirement:</strong> {item.requirement?.join(", ")}</p>
          <p><strong>Overview:</strong> {item.overview}</p>
          <p><strong>Demands & Scopes:</strong> {item.demandsAndScopes}</p>
          <p><strong>Opportunities:</strong> {item.opportunities}</p>
        </div>

        {/* What You Will Learn */}
        <div className="bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            What You Will Learn
          </h2>

          {/* Section 1 */}
          {item.whatYouWillLearn?.section1Points?.length > 0 && (
            <div className="mb-4 border rounded">
              <button
                onClick={() => toggleLearnSection("section1")}
                className="w-full flex justify-between items-center px-4 py-2 bg-white hover:bg-gray-100 font-medium text-gray-700"
              >
                {item.whatYouWillLearn.section1Title || "Section 1"}
                {expandedLearn.section1 ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedLearn.section1 && (
                <ul className="list-disc list-inside px-6 py-2 text-gray-600">
                  {item.whatYouWillLearn.section1Points.map((point, index) => (
                    <li key={`s1-${index}`}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Section 2 */}
          {item.whatYouWillLearn?.section2Points?.length > 0 && (
            <div className="mb-4 border rounded">
              <button
                onClick={() => toggleLearnSection("section2")}
                className="w-full flex justify-between items-center px-4 py-2 bg-white hover:bg-gray-100 font-medium text-gray-700"
              >
                {item.whatYouWillLearn.section2Title || "Section 2"}
                {expandedLearn.section2 ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedLearn.section2 && (
                <ul className="list-disc list-inside px-6 py-2 text-gray-600">
                  {item.whatYouWillLearn.section2Points.map((point, index) => (
                    <li key={`s2-${index}`}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
