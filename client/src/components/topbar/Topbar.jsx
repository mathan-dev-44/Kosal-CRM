import { useAuth } from "../../context/AuthContext.jsx";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          Real Estate CRM
        </h2>
        <p className="text-xs text-slate-400 dark:text-zinc-500">
          Manage your sales pipeline
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* <ThemeToggle /> */}

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">
            {user?.name}
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            {user?.role}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
