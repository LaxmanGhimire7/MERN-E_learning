import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { 
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";


function AdminNavigation() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white w-64 p-4 border-r border-blue-50 shadow-lg h-full flex flex-col">
      {/* Profile Section */}
      <NavLink 
        to="/userProfile" 
        className="flex items-center gap-4 p-4 mb-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <img
          className="h-12 w-12 rounded-full border-2 border-blue-200"
          src={`http://localhost:9000/image/${user.image}`}
          alt="user profile"
        />
        <div>
          <p className="text-sm font-medium text-blue-900">
            {user?.userName}
          </p>
          <p className="text-xs text-red-600 font-medium">
               <span className={`py-1  text-xs font-medium ${
                        user.role === "admin" 
                          ? " text-red-800"
                          : user.role === "instructor"
                          ? " text-purple-800"
                          : " text-blue-800"
                      }`}>
                        {user.role?.toUpperCase()}
                      </span>
          </p>
        </div>
      </NavLink>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1">
        <NavLink 
          to="adminHome"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
            ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50'}`
          }
        >
          <HomeIcon className="h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink 
          to="course"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
            ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50'}`
          }
        >
          <AcademicCapIcon className="h-5 w-5" />
          Course Management
        </NavLink>

        <NavLink 
          to="user"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
            ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50'}`
          }
        >
          <UserGroupIcon className="h-5 w-5" />
          User Management
        </NavLink>

        <NavLink 
          to="/userProfile"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-4
            ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50'}`
          }
        >
          <UserCircleIcon className="h-5 w-5" />
          My Profile
        </NavLink>
      </div>

      
    </div>
  );
}

export default AdminNavigation;