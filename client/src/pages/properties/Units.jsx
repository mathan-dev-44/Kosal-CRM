import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getBuildingUnitsApi,
  createUnitApi,
  updateUnitApi,
} from "../../api/properties.api.js";

import Modal from "../../components/common/Modal.jsx";
import UnitTable from "../../components/properties/UnitTable.jsx";
import UnitForm from "../../components/properties/UnitForm.jsx";

import { useAuth } from "../../context/AuthContext.jsx";

const Units = () => {
  const { buildingId } = useParams();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [units, setUnits] = useState([]);

  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadUnits = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBuildingUnitsApi(buildingId, {
        status,
        type,
      });

      setUnits(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load units.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, [buildingId, status, type]);

  const openAddModal = () => {
    setSelectedUnit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (unit) => {
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedUnit(null);
  };

  const handleSubmit = async (unitData) => {
    try {
      setSaving(true);
      setError("");

      if (selectedUnit) {
        await updateUnitApi(selectedUnit.id, unitData);
      } else {
        await createUnitApi(buildingId, unitData);
      }

      closeModal();

      await loadUnits();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save unit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div>
        <Link
          to="/properties/projects"
          className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back to Projects
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Units</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage units in this building.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Unit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Status
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Type
          </label>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="PLOT">Plot</option>
            <option value="OFFICE">Office</option>
            <option value="SHOP">Shop</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading units...
        </div>
      ) : units.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-sm font-semibold text-slate-700">
            No units found
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            No units match the selected filters.
          </p>

          {isAdmin && (
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Unit
            </button>
          )}
        </div>
      ) : (
        <UnitTable units={units} isAdmin={isAdmin} onEdit={openEditModal} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedUnit ? "Edit Unit" : "Add Unit"}
      >
        <UnitForm
          unit={selectedUnit}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Units;
