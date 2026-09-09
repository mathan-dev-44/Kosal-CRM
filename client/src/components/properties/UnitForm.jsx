import { useEffect, useState } from "react";

const unitTypes = ["APARTMENT", "VILLA", "PLOT", "OFFICE", "SHOP"];

const unitStatuses = ["AVAILABLE", "BOOKED", "BLOCKED"];

const UnitForm = ({ unit, saving, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    unitNumber: "",
    type: "APARTMENT",
    price: "",
    status: "AVAILABLE",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (unit) {
      setForm({
        unitNumber: unit.unit_number || "",
        type: unit.type || "APARTMENT",
        price: unit.price ?? "",
        status: unit.status || "AVAILABLE",
      });
    } else {
      setForm({
        unitNumber: "",
        type: "APARTMENT",
        price: "",
        status: "AVAILABLE",
      });
    }

    setError("");
  }, [unit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.unitNumber.trim()) {
      setError("Unit number is required.");
      return;
    }

    if (form.price === "") {
      setError("Price is required.");
      return;
    }

    const price = Number(form.price);

    if (Number.isNaN(price) || price < 0) {
      setError("Price must be a valid positive number.");
      return;
    }

    setError("");

    onSubmit({
      unitNumber: form.unitNumber.trim(),
      type: form.type,
      price,
      status: form.status,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium dark:text-zinc-300 text-slate-700">
          Unit Number
        </label>

        <input
          type="text"
          name="unitNumber"
          value={form.unitNumber}
          onChange={handleChange}
          placeholder="e.g. A-101"
          className="w-full rounded-lg border  border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium dark:text-zinc-300 text-slate-700">
          Property Type
        </label>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 dark:bg-zinc-900 dark:text-zinc-400 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          {unitTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium dark:text-zinc-300 text-slate-700">
          Price
        </label>

        <input
          type="number"
          name="price"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="e.g. 4500000"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium dark:text-zinc-300 text-slate-700">
          Status
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border dark:bg-zinc-900 dark:text-zinc-400 border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          {unitStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border dark:bg-zinc-900 dark:text-zinc-400 border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2.5  text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : unit ? "Update Unit" : "Create Unit"}
        </button>
      </div>
    </form>
  );
};

export default UnitForm;
