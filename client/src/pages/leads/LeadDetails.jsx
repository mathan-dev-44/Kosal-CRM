import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getLeadByIdApi } from "../../api/leads.api.js";
import Notes from "../../components/leads/Notes.jsx";
import FollowUps from "../../components/leads/FollowUps.jsx";

const formatStage = (stage) => {
  if (!stage) return "-";

  return stage
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatSource = (source) => {
  if (!source) return "-";

  return source
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const stageStyles = {
  NEW: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  CONTACTED:
    "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  SITE_VISIT:
    "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  INTERESTED:
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  NEGOTIATION:
    "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  BOOKED: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  LOST: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLead = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadByIdApi(id);

      setLead(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load lead.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLead();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading lead...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <button
          type="button"
          onClick={() => navigate("/leads")}
          className="mb-5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to Leads
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/leads")}
          className="mb-4 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to Leads
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              {lead.name}
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Lead details and activity
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              stageStyles[lead.stage] ||
              "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {formatStage(lead.stage)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Lead Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
            <InfoItem label="Name" value={lead.name} />
            <InfoItem label="Phone" value={lead.phone} />
            <InfoItem label="Email" value={lead.email || "-"} />
            <InfoItem label="Source" value={formatSource(lead.source)} />
            <InfoItem label="Stage" value={formatStage(lead.stage)} />
            <InfoItem
              label="Assigned To"
              value={lead.assigned_user_name || "Unassigned"}
            />
            <InfoItem
              label="Created"
              value={new Date(lead.created_at).toLocaleString()}
            />
            <InfoItem
              label="Last Updated"
              value={new Date(lead.updated_at).toLocaleString()}
            />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Assignment
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {lead.assigned_user_name
                ? lead.assigned_user_name.charAt(0).toUpperCase()
                : "?"}
            </div>

            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {lead.assigned_user_name || "Unassigned"}
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {lead.assigned_user_email || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Notes leadId={lead.id} />
        <FollowUps leadId={id} />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {value}
      </p>
    </div>
  );
};

export default LeadDetails;
