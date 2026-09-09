import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar.jsx";
import Topbar from "../components/topbar/Topbar.jsx";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-0 flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
