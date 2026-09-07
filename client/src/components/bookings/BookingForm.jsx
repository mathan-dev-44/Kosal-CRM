import { useEffect, useState } from "react";

import { getLeadsApi } from "../../api/leads.api.js";
import {
  getProjectsApi,
  getProjectBuildingsApi,
  getBuildingUnitsApi,
} from "../../api/properties.api.js";

const BookingForm = ({ saving, onSubmit, onCancel }) => {
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);

  const [leadId, setLeadId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [amount, setAmount] = useState("");

  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [error, setError] = useState("");

  /*
   * Load leads and projects when form opens
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError("");

        const [leadsResponse, projectsResponse] = await Promise.all([
          getLeadsApi({
            page: 1,
            limit: 100,
          }),
          getProjectsApi({
            page: 1,
            limit: 100,
          }),
        ]);

        setLeads(leadsResponse.data || []);
        setProjects(projectsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load booking data.");
      } finally {
        setLoadingLeads(false);
        setLoadingProjects(false);
      }
    };

    loadInitialData();
  }, []);

  /*
   * Load buildings when project changes
   */
  useEffect(() => {
    if (!projectId) {
      setBuildings([]);
      setBuildingId("");
      setUnits([]);
      setUnitId("");
      return;
    }

    const loadBuildings = async () => {
      try {
        setLoadingBuildings(true);
        setError("");

        const response = await getProjectBuildingsApi(projectId);

        setBuildings(response.data || []);
      } catch (err) {
        setBuildings([]);
        setError(err.response?.data?.message || "Failed to load buildings.");
      } finally {
        setLoadingBuildings(false);
      }
    };

    setBuildingId("");
    setUnitId("");
    setUnits([]);

    loadBuildings();
  }, [projectId]);

  /*
   * Load available units when building changes
   */
  useEffect(() => {
    if (!buildingId) {
      setUnits([]);
      setUnitId("");
      return;
    }

    const loadUnits = async () => {
      try {
        setLoadingUnits(true);
        setError("");

        const response = await getBuildingUnitsApi(buildingId, {
          status: "AVAILABLE",
        });

        setUnits(response.data || []);
      } catch (err) {
        setUnits([]);
        setError(
          err.response?.data?.message || "Failed to load available units.",
        );
      } finally {
        setLoadingUnits(false);
      }
    };

    setUnitId("");
    loadUnits();
  }, [buildingId]);

  /*
   * Submit booking
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!leadId) {
      setError("Please select a lead.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    if (!buildingId) {
      setError("Please select a building.");
      return;
    }

    if (!unitId) {
      setError("Please select a unit.");
      return;
    }

    if (amount === "" || Number(amount) < 0) {
      setError("Please enter a valid booking amount.");
      return;
    }

    onSubmit({
      leadId,
      unitId,
      amount: Number(amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="lead"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Lead
        </label>

        <select
          id="lead"
          value={leadId}
          onChange={(event) => setLeadId(event.target.value)}
          disabled={loadingLeads || saving}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
        >
          <option value="">
            {loadingLeads ? "Loading leads..." : "Select a lead"}
          </option>

          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.name}
              {lead.phone ? ` — ${lead.phone}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="project"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Project
        </label>

        <select
          id="project"
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          disabled={loadingProjects || saving}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
        >
          <option value="">
            {loadingProjects ? "Loading projects..." : "Select a project"}
          </option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
              {project.location ? ` — ${project.location}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="building"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Building
        </label>

        <select
          id="building"
          value={buildingId}
          onChange={(event) => setBuildingId(event.target.value)}
          disabled={!projectId || loadingBuildings || saving}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
        >
          <option value="">
            {!projectId
              ? "Select a project first"
              : loadingBuildings
                ? "Loading buildings..."
                : "Select a building"}
          </option>

          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="unit"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Available Unit
        </label>

        <select
          id="unit"
          value={unitId}
          onChange={(event) => setUnitId(event.target.value)}
          disabled={!buildingId || loadingUnits || saving}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
        >
          <option value="">
            {!buildingId
              ? "Select a building first"
              : loadingUnits
                ? "Loading available units..."
                : "Select an available unit"}
          </option>

          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.unit_number} — {unit.type} — ₹{" "}
              {Number(unit.price).toLocaleString("en-IN")}
            </option>
          ))}
        </select>

        {buildingId && !loadingUnits && units.length === 0 && (
          <p className="mt-1.5 text-xs text-slate-500">
            No available units in this building.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="amount"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Booking Amount
        </label>

        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={saving}
          placeholder="Enter booking amount"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
