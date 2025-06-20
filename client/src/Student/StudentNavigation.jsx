import { UserCircleIcon } from '@heroicons/react/24/outline'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../Context/AuthProvider'

function StudentNavigation() {
  const {user} = useContext(AuthContext);

  return (
    <div>
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

            <NavLink to="home">Dashboard</NavLink>

      <NavLink 
          to="/userProfile"
          title='My Profile'
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-4
            ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-blue-50'}`
          }
        >
          <UserCircleIcon className="h-5 w-5" />
          My Profile
        </NavLink>
    </div>
  )
}

export default StudentNavigation
