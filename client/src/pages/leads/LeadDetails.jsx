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
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-yellow-50 text-yellow-700",
  SITE_VISIT: "bg-purple-50 text-purple-700",
  INTERESTED: "bg-cyan-50 text-cyan-700",
  NEGOTIATION: "bg-orange-50 text-orange-700",
  BOOKED: "bg-green-50 text-green-700",
  LOST: "bg-red-50 text-red-700",
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
      <div className="p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-slate-500">Loading lead...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate("/leads")}
          className="mb-5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Leads
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/leads")}
          className="mb-4 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Leads
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>

            <p className="mt-1 text-sm text-slate-500">
              Lead details and activity
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              stageStyles[lead.stage] || "bg-slate-100 text-slate-700"
            }`}
          >
            {formatStage(lead.stage)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Lead Information</h2>
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

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Assignment</h2>
          </div>

          <div className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
              {lead.assigned_user_name
                ? lead.assigned_user_name.charAt(0).toUpperCase()
                : "?"}
            </div>

            <p className="text-sm font-medium text-slate-900">
              {lead.assigned_user_name || "Unassigned"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {lead.assigned_user_email || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Notes leadId={lead.id} />
        <FollowUps leadId={id} />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
};

export default LeadDetails;
