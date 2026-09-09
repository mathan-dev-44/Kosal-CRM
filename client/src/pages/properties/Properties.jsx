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

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700";

const labelCls =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const Projects = () => {
  const { user } = useAuth();

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
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Projects
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your real estate projects.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openAddModal}
            className="self-start rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:self-auto"
          >
            + Add Project
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No projects found
          </h2>

          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            Create your first real estate project.
          </p>

          {isAdmin && (
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Add Project
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-sm text-zinc-400 dark:text-zinc-500">
                      No image
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <Link
                    to={`/properties/projects/${project.id}`}
                    className="text-lg font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                  >
                    {project.name}
                  </Link>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {project.location}
                  </p>

                  {project.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                  )}

                  {isAdmin && (
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
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
            <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((previous) => Math.max(previous - 1, 1))
                  }
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {formError}
            </div>
          )}

          <div>
            <label className={labelCls}>Project Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Green Valley Residency"
              className={inputCls}
            />
          </div>

          <div className="mt-4">
            <label className={labelCls}>Location</label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Tirunelveli"
              className={inputCls}
            />
          </div>

          <div className="mt-4">
            <label className={labelCls}>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              maxLength={2000}
              placeholder="Describe the project..."
              className={`${inputCls} resize-none`}
            />

            <p className="mt-1 text-right text-xs text-zinc-400 dark:text-zinc-500">
              {form.description.length}/2000
            </p>
          </div>

          <div className="mt-4">
            <label className={labelCls}>Image URL</label>

            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/project.jpg"
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
