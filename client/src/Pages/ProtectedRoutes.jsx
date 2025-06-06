import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { useContext } from "react";


const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/students-login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
