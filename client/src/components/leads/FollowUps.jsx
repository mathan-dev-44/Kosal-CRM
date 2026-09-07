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

      /*
       * datetime-local gives:
       * 2026-09-07T15:30
       *
       * Backend Zod expects a valid ISO datetime.
       * Convert it before sending.
       */
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
        return "bg-emerald-100 text-emerald-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold text-slate-900">Follow-ups</h2>

        <p className="mt-1 text-xs text-slate-500">
          Schedule and track follow-ups for this lead.
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Schedule Follow-up
          </h3>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Date & Time
            </label>

            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Remarks
            </label>

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              placeholder="What should be discussed with the lead?"
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.remarks.length}/1000
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Scheduling..." : "Schedule Follow-up"}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">
            Loading follow-ups...
          </div>
        ) : followUps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-medium text-slate-600">
              No follow-ups yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Schedule the first follow-up for this lead.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {followUps.map((item) => {
              const isPending = item.status === "PENDING";

              const isCompleted = item.status === "COMPLETED";

              const isCancelled = item.status === "CANCELLED";

              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
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

                      <p className="mt-1 text-xs text-slate-500">
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
                          className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === item.id ? "Updating..." : "Complete"}
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() =>
                            handleStatusUpdate(item.id, "CANCELLED")
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {item.remarks && (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {item.remarks}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-400">
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
