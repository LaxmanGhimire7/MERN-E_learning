import { useContext, useEffect, useState } from "react";
import {
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import homebackground from "../images/homebackground.png";
import { IoSearchSharp } from "react-icons/io5";
import { CartContext } from "../Context/CartProvider";
import Footer from "./Footer";

function AllCourses() {
  const {dispatch} = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const item = location?.state;

  const [course, setCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState([]);

  const getCourse = async () => {
    let response = await fetch("http://localhost:9000/api/course/getAllCourse");
    response = await response.json();
    setCourse(response.response);
  };

  useEffect(() => {
    getCourse();
  }, []);



  // search garna milne from fist letter
  const filteredCourses = course.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <>
      <div
        className="relative h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${homebackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Browse Our Upcoming Classes
          </h1>
          <p className="text-lg mb-6">
            Our courses have multiple options that may match your own time.
            Browse around and see what suits you.
          </p>
          <div className="max-w-lg mx-auto flex relative">
            <input
              type="text"
              placeholder="Enter course name"
              className="w-full px-4 py-3 rounded-full text-gray-800 bg-white focus:outline-none shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearchSharp
              size={20}
              className="absolute text-black right-4 top-4"
            />
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="p-10 min-h-screen ">
        {filteredCourses.length > 0 ? (
          <div className="flex flex-wrap ml-12 gap-12 mt-12 ">
            {filteredCourses.map((item) => (
              <div
                key={item._id}
                className="w-[420px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    onClick={() =>
                      navigate("/CourseDetails", { state: { ...item } })
                    }
                    src={`http://localhost:9000/image/${item.image}`}
                    alt={item.name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300 cursor-pointer"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {item.isBestseller && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                        Bestseller
                      </span>
                    )}
                    {item.isFeatured && (
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <h2
                      onClick={() =>
                        navigate("/CourseDetails", { state: { ...item } })
                      }
                      className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-700 hover:underline break-words flex h-14 overflow-hidden"
                    >
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-3 font-medium">
                      By <span className="text-black">{item.instructor}</span>{" "}
                      <span>
                        In{" "}
                        <span className="cursor-pointer hover:text-blue-800 hover:underline font-semibold text-black">
                          {item.fields}
                        </span>
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }, (_, i) => {
                        const r = item.rating;
                        if (r >= i + 1)
                          return <FaStar key={i} className="w-5 h-5" />;
                        else if (r >= i + 0.5)
                          return <FaStarHalfAlt key={i} className="w-5 h-5" />;
                        else
                          return (
                            <FaRegStar
                              key={i}
                              className="w-5 h-5 text-gray-200"
                            />
                          );
                      })}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3">
                    {item.discountPrice < item.price && (
                      <span className="text-sm text-gray-400 line-through">
                        Rs.{item.price}
                      </span>
                    )}
                    <span className="text-2xl font-semibold text-red-600">
                      Rs.{item.discountPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full font-semibold">
                      ⏳ {item.duration} months
                    </span>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() =>
                        navigate("/CourseDetails", { state: { ...item } })
                      }
                      className="flex w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      Enroll Now
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                       dispatch({
                        type:"AddToCart",
                        payload: item,
                       });
                       navigate("/cart")
                      }}
                      className="p-3 border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-all justify-center cursor-pointer"
                    >
                      <FaShoppingCart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-96">
            <div>No courses found.</div>
          </div>
        )}
      </div>

      <Footer />

    </>
  );
}

export default AllCourses;
