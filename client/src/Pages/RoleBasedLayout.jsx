// Components/Layout/RoleBasedLayout.jsx
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import AdminNavigation from "../Admin/AdminNavigation";
import InstructorNavigation from "../Instructor/InstructorNavigation";
import StudentNavigation from "../Student/StudentNavigation";
import { AuthContext } from "../Context/AuthProvider";

function RoleBasedLayout() {
  const { user } = useContext(AuthContext);

  const renderSidebar = () => {
    if (user?.role === "admin") return <AdminNavigation />;
    if (user?.role === "instructor") return <InstructorNavigation />;
    if (user?.role === "student") return <StudentNavigation />;
    return null;
  };

  return (
    <div className="flex">
      <div className="w-64">
        {renderSidebar()}
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default RoleBasedLayout;
