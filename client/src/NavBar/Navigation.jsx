import { NavLink, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa"; 
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

function Navigation() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const userImage = user?.image
    ? `http://localhost:9000/image/${user.image}`
    : null;

  return (
    <div className="bg-blue-900 text-white p-5 flex justify-between items-center mt-18 h-16">
      <div>Explore</div>

      <div className="flex gap-6">
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

      <div className="flex items-center gap-6 mr-9 cursor-pointer">
        <NavLink to="/cart">
          <FaCartShopping size={20} />
        </NavLink>

        {/* Show user profile only if logged in */}
        {user && (
          <div onClick={() => navigate("/UserProfile")} title="Go to Profile">
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
        )}
      </div>
    </div>
  );
}

export default Navigation;
