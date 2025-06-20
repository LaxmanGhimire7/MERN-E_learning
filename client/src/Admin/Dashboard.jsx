import AdminNavigation from "./AdminNavigation";
import { Outlet } from "react-router-dom";


function Dashboard() {
  return (
    <div className="flex">
      <div>
        <AdminNavigation />
      </div>

      <div>
        <Outlet />  
      </div>
    </div>
  );
}

export default Dashboard;
