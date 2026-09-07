import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
const LeadTable = ({ leads, loading, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const getStageStyle = (stage) => {
    const styles = {
      NEW: "bg-blue-50 text-blue-700",
      CONTACTED: "bg-yellow-50 text-yellow-700",
      SITE_VISIT: "bg-purple-50 text-purple-700",
      INTERESTED: "bg-indigo-50 text-indigo-700",
      NEGOTIATION: "bg-orange-50 text-orange-700",
      BOOKED: "bg-green-50 text-green-700",
      LOST: "bg-red-50 text-red-700",
    };

    return styles[stage] || "bg-slate-100 text-slate-600";
  };

  const formatStage = (stage) => {
    return stage
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (!leads.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-600">No leads found</p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border  dark:text-zinc-100  dark:bg-zinc-950 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200   dark:text-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Lead
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Phone
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Source
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Stage
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Assigned To
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Created
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide  dark:text-zinc-100 text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="transition dark:hover:bg-zinc-600 hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="text-left"
                  >
                    <p className="text-sm font-semibold text-slate-900  dark:text-zinc-100 hover:text-slate-600">
                      {lead.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {lead.email || "No email"}
                    </p>
                  </button>
                </td>

                <td className="px-5 py-4 text-sm  dark:text-zinc-100 text-slate-600">
                  {lead.phone}
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm  dark:text-zinc-100 text-slate-600">
                    {lead.source
                      ?.replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStageStyle(
                      lead.stage,
                    )}`}
                  >
                    {formatStage(lead.stage)}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm  dark:text-zinc-100 text-slate-600">
                  {lead.assigned_user_name || "Unassigned"}
                </td>

                <td className="px-5 py-4 text-sm  dark:text-zinc-100 text-slate-500">
                  {new Date(lead.created_at).toLocaleDateString("en-IN")}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex  justify-end gap-2 ">
                    <button
                      type="button"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(lead.id)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
