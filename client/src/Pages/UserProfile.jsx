import { useContext, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { HiLogout } from "react-icons/hi";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";


function UserProfile() {
  const navigate = useNavigate();
  const { user, state, dispatch } = useContext(AuthContext);

  const [isEdit, setIsEdit] = useState(false);
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userName, setUserName] = useState(user?.userName);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const fillEdit = () => {
  setFirstName(user?.firstName || "");
  setLastName(user?.lastName || "");
  setUserName(user?.userName || "");
  setEmail(user?.email || "");
  setPhone(user?.phone || "");
  setImage(null);
};


const editUser = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("userName", userName);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("image", image);

  try {
    let response = await fetch("http://localhost:9000/api/auth/editUser", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      body: formData,
    });

    response = await response.json();
    console.log("Edit user response:", response);

    if (response.status === 200 && response.msg === "User updated successfully") {
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        setIsEdit(false);       
        window.location.reload(); 
      }, 1000);
    } else {
      toast.error(response.msg || "Failed to update profile");
    }
  } catch (error) {
    toast.error("Something went wrong!");
    console.error(error);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Profile Card */}
      <div className="mx-auto max-w-4xl bg-white rounded-3xl shadow-2xl p-8 flex items-start gap-8 transform hover:shadow-3xl transition-shadow duration-300">
        {/* Profile Image */}
        <div className="relative group group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img
            src={
              user?.image
                ? `http://localhost:9000/image/${user.image}`
                : "/default-user.png"
            }
            alt="user"
            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl relative"
          />
          <button
            onClick={() =>{
              
              setIsEdit(!isEdit)}}
            className="absolute bottom-4 right-4 bg-blue-600 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-lg"
          >
            <BiEdit className="text-white text-2xl" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xl text-gray-500 font-medium">@{user?.userName}</p>
            <div className="flex items-center gap-3">
              <span className="text-lg text-gray-600">
                <span className="font-semibold">✉️</span> {user?.email}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5">
            <button
              onClick={() => {
                dispatch({ type: "LOGOUT" });
                navigate("/");
              }}
              className="flex items-center gap-3 bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <HiLogout className="text-2xl" />
              <span className="text-lg font-semibold">Logout</span>
            </button>

            <button
              onClick={() => {
                fillEdit();
                setIsEdit(true)}}
              className="flex items-center gap-3 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <BiEdit className="text-2xl" />
              <span className="text-lg font-semibold">Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEdit && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={() => setIsEdit(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <MdCancel className="text-2xl" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={editUser} className="p-6 space-y-6">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

<div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>


                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-96 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="w-full file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                    />
                    {image && (
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Preview" 
                        className="h-20 w-20 rounded-full object-cover border-2 border-blue-100"
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
