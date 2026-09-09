import { useEffect, useState } from "react";

import {
  getLeadFollowUpsApi,
  createLeadFollowUpApi,
  updateLeadFollowUpApi,
} from "../../api/leads.api.js";

const FollowUps = ({ leadId }) => {
  const [followUps, setFollowUps] = useState([]);

  const [form, setForm] = useState({
    scheduledAt: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadFollowUpsApi(leadId);

      setFollowUps(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load follow-ups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, [leadId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.scheduledAt) {
      setError("Please select a follow-up date and time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const scheduledAt = new Date(form.scheduledAt).toISOString();

      await createLeadFollowUpApi(leadId, {
        scheduledAt,
        remarks: form.remarks.trim() || undefined,
      });

      setForm({
        scheduledAt: "",
        remarks: "",
      });

      await loadFollowUps();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create follow-up.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (followUpId, status) => {
    try {
      setUpdatingId(followUpId);
      setError("");

      await updateLeadFollowUpApi(leadId, followUpId, {
        status,
      });
      await loadFollowUps();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update follow-up.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";

      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";

      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    }
  };

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
          Follow-ups
        </h2>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Schedule and track follow-ups for this lead.
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Schedule Follow-up
          </h3>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Date &amp; Time
            </label>

            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Remarks
            </label>

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              placeholder="What should be discussed with the lead?"
              className={`${inputCls} resize-none`}
            />

            <p className="mt-1 text-right text-xs text-zinc-400 dark:text-zinc-500">
              {form.remarks.length}/1000
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving ? "Scheduling..." : "Schedule Follow-up"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Loading follow-ups...
          </div>
        ) : followUps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              No follow-ups yet
            </p>

            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Schedule the first follow-up for this lead.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {followUps.map((item) => {
              const isPending = item.status === "PENDING";

              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          Follow-up
                        </p>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {formatDate(item.scheduled_at)}
                      </p>
                    </div>

                    {isPending && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() =>
                            handleStatusUpdate(item.id, "COMPLETED")
                          }
                          className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                        >
                          {updatingId === item.id ? "Updating..." : "Complete"}
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() =>
                            handleStatusUpdate(item.id, "CANCELLED")
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {item.remarks && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {item.remarks}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                    Created {formatDate(item.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUps;
