import { UserCircleIcon } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";

function InstructorNavigation() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-64 min-h-screen h-full bg-white shadow p-4 flex flex-col justify-between">
      <div>
        {/* Profile Info */}
        <NavLink
          to="/userProfile"
          className="flex items-center gap-4 p-4 mb-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
        >
          <img
            src={`http://localhost:9000/image/${user.image}`}
            alt={`${user?.userName} profile`}
            className="h-12 w-12 rounded-full border-2 border-blue-200"
          />
          <div>
            <p className="text-sm font-semibold text-blue-900">{user?.userName}</p>
            <p
              className={`text-xs font-medium ${
                user.role === "admin"
                  ? "text-red-700"
                  : user.role === "instructor"
                  ? "text-purple-700"
                  : "text-blue-700"
              }`}
            >
              {user.role?.toUpperCase()}
            </p>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <NavLink
            to="instructorHome"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="createAssignment"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            Create Assignment
          </NavLink>

          {/* Changed this nav link */}
          <NavLink
            to="assignments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            Assignments
          </NavLink>




          <NavLink
            to="/userProfile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium mt-6 ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            <UserCircleIcon className="h-5 w-5" />
            My Profile
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default InstructorNavigation;
