import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getProjectByIdApi,
  getProjectBuildingsApi,
  createBuildingApi,
  updateBuildingApi,
  deleteBuildingApi,
} from "../../api/properties.api.js";

import Modal from "../../components/common/Modal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const emptyBuildingForm = {
  name: "",
};

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [project, setProject] = useState(null);
  const [buildings, setBuildings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [buildingsLoading, setBuildingsLoading] = useState(true);

  const [error, setError] = useState("");
  const [buildingError, setBuildingError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [form, setForm] = useState(emptyBuildingForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjectByIdApi(id);

      setProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  const loadBuildings = async () => {
    try {
      setBuildingsLoading(true);
      setBuildingError("");

      const response = await getProjectBuildingsApi(id);

      setBuildings(response.data || []);
    } catch (err) {
      setBuildingError(
        err.response?.data?.message || "Failed to load buildings.",
      );
    } finally {
      setBuildingsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    loadBuildings();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddBuildingModal = () => {
    setSelectedBuilding(null);
    setForm(emptyBuildingForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditBuildingModal = (building) => {
    setSelectedBuilding(building);

    setForm({
      name: building.name || "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedBuilding(null);
    setForm(emptyBuildingForm);
    setFormError("");
  };

  const handleSubmitBuilding = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Building name is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      setBuildingError("");

      const payload = {
        name: form.name.trim(),
      };

      if (selectedBuilding) {
        await updateBuildingApi(selectedBuilding.id, payload);
      } else {
        await createBuildingApi(id, payload);
      }

      closeModal();

      await loadBuildings();
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        setFormError(backendErrors.map((item) => item.message).join(", "));
      } else {
        setFormError(err.response?.data?.message || "Failed to save building.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBuilding = async (building) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${building.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBuildingError("");

      await deleteBuildingApi(building.id);

      await loadBuildings();
    } catch (err) {
      setBuildingError(
        err.response?.data?.message || "Failed to delete building.",
      );
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Loading project...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error || "Project not found."}
        </div>

        <Link
          to="/properties/projects"
          className="mt-4 inline-block text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Link
          to="/properties/projects"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to Projects
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              {project.name}
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {project.location}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid lg:grid-cols-2">
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.name}
              className="h-64 w-full object-cover lg:h-full lg:min-h-72"
            />
          ) : (
            <div className="flex min-h-64 items-center justify-center bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 lg:min-h-72">
              No image
            </div>
          )}

          <div className="p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Project Information
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Project Name
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {project.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Location
                </p>

                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {project.location}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  Description
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {project.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Buildings
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage buildings under this project.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={openAddBuildingModal}
            className="self-start rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:self-auto"
          >
            + Add Building
          </button>
        )}
      </div>

      {buildingError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {buildingError}
        </div>
      )}

      {buildingsLoading ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Loading buildings...
        </div>
      ) : buildings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No buildings found
          </h3>

          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            No buildings have been added to this project yet.
          </p>

          {isAdmin && (
            <button
              type="button"
              onClick={openAddBuildingModal}
              className="mt-4 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Add Building
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
            <div
              key={building.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    Building
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {building.name}
                  </h3>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  B
                </div>
              </div>

              <Link
                to={`/properties/buildings/${building.id}/units`}
                className="mt-4 block text-center text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                View Units →
              </Link>

              {isAdmin && (
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditBuildingModal(building)}
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteBuilding(building)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedBuilding ? "Edit Building" : "Add Building"}
      >
        <form onSubmit={handleSubmitBuilding}>
          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {formError}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Building Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Block A"
              className={inputCls}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving
                ? "Saving..."
                : selectedBuilding
                  ? "Update Building"
                  : "Create Building"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
