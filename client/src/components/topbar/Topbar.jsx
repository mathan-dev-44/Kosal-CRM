import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../theme/Themetoggle.jsx";

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden"
          aria-label="Open menu"
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 sm:text-lg">
            Real Estate CRM
          </h2>
          <p className="hidden text-xs text-zinc-400 dark:text-zinc-500 sm:block">
            Manage your sales pipeline
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {user?.name}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {user?.role}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
