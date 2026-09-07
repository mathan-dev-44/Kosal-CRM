import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  source: "WEBSITE",
  stage: "NEW",
};

const LeadForm = ({ lead = null, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        source: lead.source || "WEBSITE",
        stage: lead.stage || "NEW",
      });
    } else {
      setForm(initialForm);
    }
  }, [lead]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Lead Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter lead name"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Phone
        </label>

        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Source
        </label>

        <select
          name="source"
          value={form.source}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          <option value="WEBSITE">Website</option>

          <option value="FACEBOOK">Facebook</option>

          <option value="INSTAGRAM">Instagram</option>

          <option value="REFERRAL">Referral</option>

          <option value="WALK_IN">Walk In</option>

          <option value="PHONE">Phone</option>

          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Stage
        </label>

        <select
          name="stage"
          value={form.stage}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="SITE_VISIT">Site Visit</option>
          <option value="INTERESTED">Interested</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="BOOKED">Booked</option>
          <option value="LOST">Lost</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
