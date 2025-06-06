import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartProvider";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const item = location?.state;

  return (
    <div className="p-6 bg-white">
      <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gray-100 p-4">
          <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
          <p className="text-sm text-gray-600 mt-1">
            By <span className="font-semibold">{item.instructor}</span>
          </p>
          <div className="flex items-center text-yellow-400 mt-2">
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

        <div className="text-center">
          <button onClick={()=>{
            dispatch({
              type: "AddToCart",
              payload: item,
            })
          }} className="bg-blue-700 text-white p-3 mt-5 rounded-2xl w-56">
            Add To Cart
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="md:w-1/2">
            <img
              className="w-full h-auto rounded-lg"
              src={`http://localhost:9000/image/${item.image}`}
              alt={item.name}
            />
          </div>

          <div className="md:w-1/2 text-sm text-gray-700 space-y-2">
            <p>
              <strong>Category:</strong> {item.categories}
            </p>
            <p>
              <strong>Duration:</strong> {item.duration}
            </p>
            <p>
              <strong>Period:</strong> {item.period}
            </p>
            <p>
              <strong>Requirement:</strong> {item.requirement}
            </p>
            <p>
              <strong>Overview:</strong> {item.overview}
            </p>
            <p>
              <strong>Demands & Scopes:</strong> {item.demandsAndScopes}
            </p>
            <p>
              <strong>Opportunities:</strong> {item.opportunities}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            What You Will Learn
          </h2>

          {item.whatYouWillLearn?.section1Points?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-md font-medium text-gray-700">Section 1:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {item.whatYouWillLearn.section1Points.map((point, index) => (
                  <li key={`s1-${index}`}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {item.whatYouWillLearn?.section2Points?.length > 0 && (
            <div className="mb-3">
              <h3 className="text-md font-medium text-gray-700">Section 2:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {item.whatYouWillLearn.section2Points.map((point, index) => (
                  <li key={`s2-${index}`}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
