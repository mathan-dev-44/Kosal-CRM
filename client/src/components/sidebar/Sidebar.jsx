import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "▦",
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Leads",
      path: "/leads",
      icon: "♙",
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Properties",
      path: "/properties/projects",
      icon: "⌂",
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Bookings",
      path: "/bookings",
      icon: "▤",
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Employees",
      path: "/users",
      icon: "♟",
      roles: ["ADMIN"],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            EstateCRM
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Real Estate Management
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 lg:hidden"
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Main Menu
        </p>
        <div className="space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`
              }
            >
              <span className="flex w-5 justify-center text-base">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Logged in as
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {user?.name}
          </p>
          <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {user?.role}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
