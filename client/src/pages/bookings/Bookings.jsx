import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBookingsApi, createBookingApi } from "../../api/bookings.api.js";

import BookingForm from "../../components/bookings/BookingForm.jsx";
import Modal from "../../components/common/Modal.jsx";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookingsApi();

      const bookingList = response.data?.data;

      setBookings(Array.isArray(bookingList) ? bookingList : []);
    } catch (err) {
      console.error("Load bookings error:", err);

      setBookings([]);

      setError(err.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleOpenCreate = () => {
    setError("");
    setSuccess("");
    setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    if (saving) {
      return;
    }

    setShowCreateModal(false);
  };

  const handleCreateBooking = async (bookingData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createBookingApi(bookingData);

      setShowCreateModal(false);

      setSuccess("Booking created successfully.");

      await loadBookings();
    } catch (err) {
      console.error("Create booking error:", err);

      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "₹ 0";
    }

    return `₹ ${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage property bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Create Booking
        </button>
      </div>

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-3 text-sm text-slate-500">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No bookings found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create your first property booking.
          </p>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Create Booking
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lead
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Property
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Unit
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Booked By
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {booking.lead_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.lead_phone || booking.lead_email || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {booking.project_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.building_name || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {booking.unit_number || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.unit_type || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                      {formatPrice(booking.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {booking.booked_by_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {booking.booked_by_email || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(booking.booked_at)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreate}
        title="Create Booking"
      >
        <BookingForm
          saving={saving}
          onSubmit={handleCreateBooking}
          onCancel={handleCloseCreate}
        />
      </Modal>
    </div>
  );
};

export default Bookings;
