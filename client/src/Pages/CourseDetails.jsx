import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../Context/CartProvider";
import {
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaClock,
  FaCertificate,
  FaInfinity,
  FaCheck,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaTag,
  FaChartLine,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);
  const item = location?.state;
  const { courseId } = useParams();

  const [expandedLearn, setExpandedLearn] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
  });

  const [activeTab, setActiveTab] = useState("about");
  const [reviews, setReviews] = useState([]);

  const toggleLearnSection = (section) => {
    setExpandedLearn((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    if (activeTab === "reviews") {
      // Fetch reviews from backend when Reviews tab is active
      fetch(`http://localhost:9000/api/course/${courseId}/reviews`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReviews(data.reviews);
          } else {
            setReviews([]);
          }
        })
        .catch(() => setReviews([]));
    }
  }, [activeTab, courseId]);

  if (!item) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Course not found</p>
      </div>
    );
  }

  // Calculate discount percentage safely (avoid negative or NaN)
  const discountPercentage =
    item.discountPrice && item.price && item.discountPrice > item.price
      ? Math.round(
          ((item.discountPrice - item.price) / item.discountPrice) * 100
        )
      : 0;

  // Helper to render each "What You Will Learn" section
  const renderLearnSection = (sectionKey, defaultTitle) => {
    const title = item.whatYouWillLearn?.[`${sectionKey}Title`] || defaultTitle;
    const points = item.whatYouWillLearn?.[`${sectionKey}Points`] || [];

    if (!points.length) return null;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => toggleLearnSection(sectionKey)}
          className="w-full flex justify-between items-center px-5 py-4 bg-gray-50 hover:bg-gray-100 font-medium text-gray-700"
        >
          <div className="flex items-center">
            <span className="mr-3 text-blue-600 font-semibold">
              {title || sectionKey}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-3">
              {points.length} lecture{points.length > 1 ? "s" : ""} • ~{points.length * 5} min
            </span>
            {expandedLearn[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
        {expandedLearn[sectionKey] && (
          <ul className="bg-white divide-y divide-gray-100">
            {points.map((point, idx) => (
              <li
                key={`${sectionKey}-${idx}`}
                className="py-3 px-5 flex items-start hover:bg-gray-50 group"
              >
                <FaPlayCircle className="text-gray-400 mr-3 mt-1 flex-shrink-0 group-hover:text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 group-hover:text-blue-600">
                    Lecture {idx + 1}: {point}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">5 min</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Preview
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb / Category */}
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-1">
        Categories:{" "}
        <span className="text-gray-700 font-medium">{item.fields || "N/A"}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-3 gap-2 flex-wrap">
                    {item.isBestseller && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded flex items-center">
                        <FaTag className="mr-1" /> Bestseller
                      </span>
                    )}
                    {item.isFeatured && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {item.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {item.tagline || "Master essential skills with industry experts"}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-2">
                        {Array.from({ length: 5 }, (_, i) => {
                          const r = item.rating;
                          if (r >= i + 1) return <FaStar key={i} className="w-4 h-4" />;
                          else if (r >= i + 0.5)
                            return <FaStarHalfAlt key={i} className="w-4 h-4" />;
                          else
                            return (
                              <FaRegStar
                                key={i}
                                className="w-4 h-4 text-gray-300"
                              />
                            );
                        })}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {item.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-1 text-gray-500" />
                      <span>{item.duration || "Self-paced"}</span>
                    </div>
                    {item.period && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">
                          {item.period}
                        </span>
                      </>
                    )}
                    {item.categories && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">
                          {item.categories}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-500 font-semibold text-sm">
                  {item.instructor?.charAt(0) || "I"}
                </div>
                <div>
                  <p className="text-xs text-gray-500 tracking-wider">CREATED BY</p>
                  <p className="font-semibold text-gray-800">{item.instructor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Preview Image */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
            <img
              className="w-full h-auto object-cover rounded-xl border-2 border-gray-300"
              src={`http://localhost:9000/image/${item.image || "default-course.jpg"}`}
              alt={item.name}
            />
          </div>

          {/* Course Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "about"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "reviews"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {/* Course Content */}
          {activeTab === "about" && (
            <>
              {/* Overview + Demands + Opportunities + Requirements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                    Course Overview
                  </h2>
                  <div className="space-y-6">
                    {item.overview && (
                      <div className="prose max-w-none">
                        <p>{item.overview}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-5">
                      {item.requirement?.length > 0 && (
                        <div className="bg-blue-50 p-5 rounded-lg flex-1 min-w-[280px]">
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <FaGraduationCap className="text-blue-600 mr-2" />
                            Requirements
                          </h3>
                          <ul className="list-disc list-inside space-y-2 pl-4">
                            {item.requirement.map((req, i) => (
                              <li key={i} className="pl-2 text-gray-700">
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.demandsAndScopes && (
                        <div className="bg-green-50 p-5 rounded-lg flex-1 min-w-[280px]">
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <FaChartLine className="text-green-600 mr-2" />
                            Industry Demand
                          </h3>
                          <p className="text-gray-700">{item.demandsAndScopes}</p>
                        </div>
                      )}

                      {item.opportunities && (
                        <div className="bg-purple-50 p-5 rounded-lg flex-1 min-w-[280px]">
                          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <FaBriefcase className="text-purple-600 mr-2" />
                            Career Opportunities
                          </h3>
                          <p className="text-gray-700">{item.opportunities}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Will Learn — Now 4 sections */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                    Course Curriculum
                  </h2>

                  {renderLearnSection("section1", "Foundation & Core Concepts")}
                  {renderLearnSection("section2", "Advanced Techniques")}
                  {renderLearnSection("section3", "Practical Applications")}
                  {renderLearnSection("section4", "Expert Insights")}
                </div>
              </div>
            </>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Reviews
              </h2>
              {reviews.length === 0 && (
                <p className="text-gray-600">No reviews yet.</p>
              )}
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="mb-6 border-b border-gray-200 pb-4 last:border-none"
                >
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400 mr-2">
                      {Array.from({ length: 5 }, (_, i) => {
                        if (review.rating >= i + 1)
                          return <FaStar key={i} className="w-4 h-4" />;
                        else if (review.rating >= i + 0.5)
                          return <FaStarHalfAlt key={i} className="w-4 h-4" />;
                        else
                          return (
                            <FaRegStar
                              key={i}
                              className="w-4 h-4 text-gray-300"
                            />
                          );
                      })}
                    </div>
                    <span className="font-semibold text-gray-800">
                      {review.reviewerName}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Pricing & Info */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-baseline mb-3 gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  Rs.{item.discountPrice}
                </span>
                <span className="ml-2 text-gray-400 line-through">
                  Rs.{item.price}
                </span>
                {discountPercentage > 0 && (
                  <span className="ml-2 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 mb-4">
                <button
                  onClick={() => dispatch({ type: "AddToCart", payload: item })}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Add to Cart
                </button>

                <button  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition duration-200">
                  Buy Now
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  30-Day Money-Back Guarantee
                </p>
                <p className="text-xs text-gray-500">
                  Full Lifetime Access • Certificate Included
                </p>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                  ✓
                </span>
                This course includes:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaPlayCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    {item.duration || "Self-paced"} hours on-demand video
                  </span>
                </li>
                <li className="flex items-start">
                  <FaInfinity className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Full lifetime access</span>
                </li>
                <li className="flex items-start">
                  <FaCertificate className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Certificate of completion
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">8 downloadable resources</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    Access on mobile and TV
                  </span>
                </li>
              </ul>
            </div>

            {item.language && (
              <div className="p-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Language</h4>
                <p className="text-gray-700">{item.language}</p>
              </div>
            )}

            {item.period && (
              <div className="p-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Course Duration</h4>
                <p className="text-gray-700">{item.period}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
