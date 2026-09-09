import { useNavigate } from "react-router-dom";

const LeadTable = ({ leads, loading, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const getStageStyle = (stage) => {
    const styles = {
      NEW: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      CONTACTED:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
      SITE_VISIT:
        "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      INTERESTED:
        "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
      NEGOTIATION:
        "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
      BOOKED:
        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      LOST: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    };

    return (
      styles[stage] ||
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
    );
  };

  const formatStage = (stage) => {
    return stage
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (!leads.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          No leads found
        </p>

        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Lead
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Phone
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Source
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Stage
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Assigned To
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Created
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="text-left"
                  >
                    <p className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300">
                      {lead.name}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                      {lead.email || "No email"}
                    </p>
                  </button>
                </td>

                <td className="px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {lead.phone}
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
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

                <td className="px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {lead.assigned_user_name || "Unassigned"}
                </td>

                <td className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(lead.created_at).toLocaleDateString("en-IN")}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(lead.id)}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
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
