import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar.jsx";
import Topbar from "../components/topbar/Topbar.jsx";

const DashboardLayout = () => {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-50 dark:bg-black">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
