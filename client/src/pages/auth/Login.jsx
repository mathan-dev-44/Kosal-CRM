import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import ThemeToggle from "../../components/theme/Themetoggle.jsx";

const Login = () => {
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
        <div className="max-w-lg">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            RE
          </div>

          <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
            Manage your real estate business
            <span className="text-blue-500"> smarter.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Manage leads, properties, follow-ups and bookings from one powerful
            CRM.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-900 lg:w-[480px]">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              RE
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              EstateCRM
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to your CRM account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
