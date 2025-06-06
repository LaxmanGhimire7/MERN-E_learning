import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { RiDeleteBin6Line } from "react-icons/ri";

function UserManagement() {
  const { state } = useContext(AuthContext);
  const [allUser, setAllUser] = useState([]);

  const getAllUser = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/auth/getAllUser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllUser(data.user);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const deleteUser = async (id) => {
    let response = await fetch(
      `http://localhost:9000/api/auth/deleteUser/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      }
    );
    if (response.ok) {
      response = await response.json();
      console.log(response);
      getAllUser();
      alert(response.msg);
    } else {
      alert("Something went wrong ");
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <div className="p-6 ml-20 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Internal Users</h1>
      {allUser.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {allUser.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-200 text-blue-700 font-bold rounded-full flex items-center justify-center">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {`${user.firstName} ${user.lastName}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.userName}
                      </div>
                    </div>
                  </td>

                  {/* This is for email */}
                  <td className="py-3 px-4">{user.email}</td>

                  {/* This is for user.role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "instructor"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* This is for active */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Yo table data chai for id created at */}
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",})}
                  </td>
                  {/* this is for last login */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastLogin).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {/* delete/action button */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this user?"
                        );
                        if (confirmDelete) {
                          deleteUser(user._id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
}

export default UserManagement;
