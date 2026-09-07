const UnitTable = ({ units, isAdmin, onEdit }) => {
  const getStatusClasses = (status) => {
    if (status === "AVAILABLE") {
      return "bg-green-50 text-green-700";
    }

    if (status === "BOOKED") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Unit
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              {isAdmin && (
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {units.map((unit) => (
              <tr key={unit.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {unit.unit_number}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-slate-600">{unit.type}</p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800">
                    ₹ {Number(unit.price).toLocaleString("en-IN")}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                      unit.status,
                    )}`}
                  >
                    {unit.status}
                  </span>
                </td>

                {isAdmin && (
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(unit)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitTable;
