import { useEffect, useState } from "react";

import { getUsersApi, createUserApi } from "../../api/users.api.js";

import Modal from "../../components/common/Modal.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState(initialForm);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsersApi({
        page,
        limit: 10,
      });

      setUsers(Array.isArray(response.data) ? response.data : []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  const openCreateModal = () => {
    setForm(initialForm);
    setFormError("");
    setModalOpen(true);
  };

  const closeCreateModal = () => {
    if (submitting) return;

    setModalOpen(false);
    setForm(initialForm);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFormError("");

      await createUserApi({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setModalOpen(false);
      setForm(initialForm);

      setPage(1);

      await fetchUsers();
    } catch (err) {
      console.error(err);

      setFormError(err.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>

          <p className="mt-1 text-sm text-slate-500">Manage sales employees</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Sales User
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first sales employee.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-600">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-600">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-600">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">{user.email}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <p className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages),
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeCreateModal}
        title="Add Sales User"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter employee email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            New users created here will automatically have the{" "}
            <strong>SALES</strong> role.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCreateModal}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
