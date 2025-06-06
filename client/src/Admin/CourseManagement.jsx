import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CourseManagement() {
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate();

  const getCourse = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/course/getAllCourse");
      response = await response.json();
      setCourseList(response.response);
    } catch (error) {
      console.error("Error fetching course list:", error);
    }
  };

  const deleteCourse =async (id)=>{
try {
  let response = await fetch (`http://localhost:9000/api/course/deleteCourse/${id}`,{
    method:"DELETE",
  })
  if(!response.ok){
    console.log("error")
    alert("error");
    return;
  };
  response = await response.json();
  console.log(response);
 toast.success("Course deleted successfully");
  getCourse();

} catch (error) {
  console.log(error)
}
  }

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <div className="px-8 py-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Course Management
          </h1>
          <NavLink
            to="AddCourseDetails"
            className="bg-blue-600 ml-96 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>+</span>
            Add Course Details
          </NavLink>

          <NavLink
            to="addCourse"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span>+</span>
            Add New Course
          </NavLink>
        </div>

        <div className="flex flex-wrap gap-6">
          {courseList.length > 0 ? (
            courseList.map((item) => (
              <div
                key={item._id}
                className="bg-white w-96 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={`http://localhost:9000/image/${item.image}`}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {item.isBestseller && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        Bestseller
                      </span>
                    )}
                    {item.isFeatured && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-gray-900 h-14">{item.name}</h2>
                  <p> By <span className="text-black">{item.instructor}</span>  <span>In <span className="cursor-pointer hover:text-blue-800 hover:underline font-semibold text-black">{item.fields}</span></span></p>

                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => {
                        const r = item.rating;
                        if (r >= i + 1) return <FaStar key={i} className="w-4 h-4" />;
                        else if (r >= i + 0.5) return <FaStarHalfAlt key={i} className="w-4 h-4" />;
                        else return <FaRegStar key={i} className="w-4 h-4 text-gray-300" />;
                      })}
                    </div>
                    <span className="text-sm font-medium text-gray-500">({item.rating})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.discountPrice < item.price && (
                      <span className="text-sm text-gray-400 line-through">Rs {item.price}</span>
                    )}
                    <span className="text-xl font-bold text-blue-600">Rs {item.discountPrice}</span>
                  </div>

                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Duration:</span> {item.duration}
                  </p>

                  <div className="flex gap-3 mt-2">
                    <button
                     
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      Enroll Now
                    </button>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => navigate("editCourse", { state: { ...item } })}
                      className="flex-1 bg-gray-100 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CiEdit className="w-5 h-5" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(item._id)}
                      className="flex-1 bg-gray-100 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 animate-pulse">Loading courses...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseManagement;