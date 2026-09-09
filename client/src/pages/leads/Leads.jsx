import { useEffect, useState } from "react";

import {
  createLeadApi,
  deleteLeadApi,
  getLeadsApi,
  updateLeadApi,
} from "../../api/leads.api.js";

import LeadTable from "../../components/leads/LeadTable.jsx";
import LeadForm from "../../components/leads/LeadForm.jsx";
import Modal from "../../components/common/Modal.jsx";

const Leads = () => {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeadsApi({
        page,
        limit: 10,
        search,
        stage,
      });

      setLeads(response.data || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [page, stage]);

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    loadLeads();
  };

  const handleAddLead = () => {
    setSelectedLead(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedLead(null);
    setFormError("");
  };

  const handleSubmitLead = async (formData) => {
    try {
      setSaving(true);
      setFormError("");

      if (selectedLead) {
        await updateLeadApi(selectedLead.id, formData);
      } else {
        await createLeadApi(formData);
      }

      setIsModalOpen(false);
      setSelectedLead(null);

      await loadLeads();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save lead.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteLeadApi(id);

      await loadLeads();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lead.");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Leads
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage and track your real estate leads.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLead}
          className="self-start rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:self-auto"
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search by name, phone or email..."
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          />

          <select
            value={stage}
            onChange={(event) => {
              setStage(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          >
            <option value="">All Stages</option>

            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="SITE_VISIT">Site Visit</option>
            <option value="INTERESTED">Interested</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="BOOKED">Booked</option>
            <option value="LOST">Lost</option>
          </select>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <LeadTable
        leads={leads}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEditLead}
      />

      {!loading && leads.length > 0 && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((previous) => previous - 1)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((previous) => previous + 1)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedLead ? "Edit Lead" : "Add New Lead"}
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {formError}
          </div>
        )}

        <LeadForm
          lead={selectedLead}
          onSubmit={handleSubmitLead}
          onCancel={handleCloseModal}
          loading={saving}
        />
      </Modal>
    </div>
  );
};

export default Leads;
