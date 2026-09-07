import { useEffect, useState } from "react";

import { getDashboardApi } from "../../api/dashboard.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardApi();

        setDashboard(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100" />

          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const leads = dashboard?.leads || {};
  const bookings = dashboard?.bookings || {};
  const followUps = dashboard?.followUps || {};
  const units = dashboard?.units || {};

  const totalUnits =
    Number(units.available || 0) +
    Number(units.booked || 0) +
    Number(units.blocked || 0);

  return (
    <div className="p-6 dark:bg-zinc-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Welcome back, {user?.name || "User"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={leads.total}
          description="Leads in pipeline"
        />

        <StatCard
          title="Total Bookings"
          value={bookings.total}
          description="Successful bookings"
        />

        <StatCard
          title="Booking Value"
          value={`₹${formatNumber(bookings.totalValue)}`}
          description="Total booking amount"
        />

        <StatCard
          title="Follow-ups Today"
          value={followUps.today}
          description="Scheduled for today"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
              Lead Pipeline
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Current leads by stage
            </p>
          </div>

          <div className="space-y-4">
            <PipelineRow label="New" value={leads.new} total={leads.total} />

            <PipelineRow
              label="Contacted"
              value={leads.contacted}
              total={leads.total}
            />

            <PipelineRow
              label="Site Visit"
              value={leads.siteVisits}
              total={leads.total}
            />

            <PipelineRow
              label="Interested"
              value={leads.interested}
              total={leads.total}
            />

            <PipelineRow
              label="Negotiation"
              value={leads.negotiation}
              total={leads.total}
            />

            <PipelineRow
              label="Booked"
              value={leads.booked}
              total={leads.total}
            />

            <PipelineRow label="Lost" value={leads.lost} total={leads.total} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
              Unit Availability
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Current property inventory
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InventoryCard label="Available" value={units.available} />

            <InventoryCard label="Booked" value={units.booked} />

            <InventoryCard label="Blocked" value={units.blocked} />

            <InventoryCard label="Total Units" value={totalUnits} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">
            Follow-ups
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Follow-up activity
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-zinc-800">
            <p className="text-sm text-slate-500 dark:text-zinc-400">Today</p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
              {followUps.today ?? 0}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-zinc-800">
            <p className="text-sm text-slate-500 dark:text-zinc-400">Pending</p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
              {followUps.pending ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 * ============================================
 * STAT CARD
 * ============================================
 */

const StatCard = ({ title, value, description }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
        {value ?? 0}
      </p>

      <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
        {description}
      </p>
    </div>
  );
};

/*
 * ============================================
 * PIPELINE ROW
 * ============================================
 */

const PipelineRow = ({ label, value, total }) => {
  const currentValue = Number(value || 0);
  const totalValue = Number(total || 0);

  const percentage =
    totalValue > 0 ? Math.min((currentValue / totalValue) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-slate-600 dark:text-zinc-400">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
          {currentValue}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-slate-800 transition-all duration-500 dark:bg-slate-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

/*
 * ============================================
 * INVENTORY CARD
 * ============================================
 */

const InventoryCard = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-800">
      <p className="text-sm text-slate-500 dark:text-zinc-400">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
        {value ?? 0}
      </p>
    </div>
  );
};

/*
 * ============================================
 * FORMAT NUMBER
 * ============================================
 */

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

export default Dashboard;
