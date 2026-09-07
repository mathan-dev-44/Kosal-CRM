import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from "../../api/properties.api.js";

import Modal from "../../components/common/Modal.jsx";

import { useAuth } from "../../context/AuthContext.jsx";

const emptyForm = {
  name: "",
  description: "",
  location: "",
  imageUrl: "",
};

const Projects = () => {
  console.log("pppprender");
  const { user } = useAuth();
  console.log(user, "user");

  const isAdmin = user?.role === "ADMIN";

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [selectedProject, setSelectedProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjectsApi({
        page,
        limit: 10,
      });

      setProjects(response.data || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [page]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setSelectedProject(null);
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setSelectedProject(project);

    setForm({
      name: project.name || "",
      description: project.description || "",
      location: project.location || "",
      imageUrl: project.image_url || "",
    });

    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedProject(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Project name is required.");
      return;
    }

    if (!form.location.trim()) {
      setFormError("Location is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
      };

      if (selectedProject) {
        await updateProjectApi(selectedProject.id, payload);
      } else {
        await createProjectApi(payload);
      }

      closeModal();

      await loadProjects();
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        setFormError(backendErrors.map((item) => item.message).join(", "));
      } else {
        setFormError(err.response?.data?.message || "Failed to save project.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProjectApi(project.id);

      /*
       * If the deleted project was the last item
       * on the current page, move back one page.
       */
      if (projects.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await loadProjects();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your real estate projects.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + Add Project
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-sm font-semibold text-slate-700">
            No projects found
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Create your first real estate project.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Project
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-slate-100">
                    <span className="text-sm text-slate-400">No image</span>
                  </div>
                )}

                <div className="p-5">
                  <Link
                    to={`/properties/projects/${project.id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-slate-600"
                  >
                    {project.name}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    {project.location}
                  </p>

                  {project.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {project.description}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((previous) => Math.max(previous - 1, 1))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((previous) =>
                      Math.min(previous + 1, pagination.totalPages),
                    )
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedProject ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Green Valley Residency"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Tirunelveli"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              maxLength={2000}
              placeholder="Describe the project..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.description.length}/2000
            </p>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Image URL
            </label>

            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/project.jpg"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : selectedProject
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
