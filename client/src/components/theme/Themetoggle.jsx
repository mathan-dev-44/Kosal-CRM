import { useTheme } from "../../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
