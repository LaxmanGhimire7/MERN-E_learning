import { NavLink, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../Context/AuthProvider";

function Navigation() {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userImage = user?.image
    ? `http://localhost:9000/image/${user.image}`
    : null;

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div className="bg-blue-900 text-white p-5 flex justify-between items-center mt-18 h-16 relative z-10">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        Explore
      </div>

      <div className="flex gap-6 items-center">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/allCourses">All Courses</NavLink>
        <NavLink to="/aboutUS">About Us</NavLink>
        <NavLink to="/OrderHistory">OrderHistory</NavLink>
        <NavLink to="/Contact">Contact</NavLink>

        {user?.role === "admin" && (
          <>
            <NavLink to="/dashboard">Admin Dashboard</NavLink>
            <NavLink to="/instructor-dashboard">Instructor Portal</NavLink>
            <NavLink to="/student-dashboard">Student Portal</NavLink>
          </>
        )}

        {user?.role === "instructor" && (
          <NavLink to="/instructor-dashboard">Instructor Portal</NavLink>
        )}

        {user?.role === "student" && (
          <NavLink to="/student-dashboard">Student Portal</NavLink>
        )}
      </div>

      <div className="flex items-center gap-6 mr-9 cursor-pointer relative" ref={dropdownRef}>
        <NavLink to="/cart">
          <FaCartShopping size={20} />
        </NavLink>

        {/* User Profile dropdown */}
        {user && (
          <div>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Profile Options"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <FaUserCircle size={28} />
              )}
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 text-gray-800 z-50">
                <div className="px-4 py-2 border-b text-gray-700 font-semibold">
                  {user?.firstName} {user?.lastName}
                </div>
                <button
                  onClick={() => {
                    navigate("/UserProfile");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <HiLogout />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
