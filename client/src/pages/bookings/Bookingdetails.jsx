import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getBookingByIdApi } from "../../api/bookings.api.js";

const BookingDetails = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBookingByIdApi(id);

        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load booking.");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const formatPrice = (amount) => {
    if (amount === null || amount === undefined) {
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border dark:text-zinc-400 border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading booking...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

        <Link
          to="/bookings"
          className="mt-4 inline-block text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          ← Back to Bookings
        </Link>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/bookings"
          className="text-sm font-medium dark:text-zinc-300 text-slate-500 dark:hover:text-slate-50 hover:text-slate-900"
        >
          ← Back to Bookings
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold dark:text-zinc-300 text-slate-900">
            Booking Details
          </h1>

          <p className="mt-1 text-sm dark:text-zinc-300 text-slate-500">
            Booking ID: {booking.id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold dark:text-zinc-300 text-slate-900">
            Lead Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase  text-slate-400 dark:text-zinc-300">
                Name
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-300">
                {booking.lead_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Phone
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">
                {booking.lead_phone || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Email
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">
                {booking.lead_email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Stage
              </p>

              <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {booking.lead_stage}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border  dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold  text-slate-900 dark:text-slate-300">
            Property Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Project
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-300">
                {booking.project_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Location
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">
                {booking.project_location}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Building
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-300">
                {booking.building_name}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-300">
            Unit Information
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Unit
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-300">
                {booking.unit_number}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Type
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">
                {booking.unit_type}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Unit Price
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-300">
                {formatPrice(booking.unit_price)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Status
              </p>

              <span className="mt-1 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                {booking.unit_status}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-300">
            Booking Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Booking Amount
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-300">
                {formatPrice(booking.amount)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Booked By
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-300">
                {booking.booked_by_name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {booking.booked_by_email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400 dark:text-zinc-300">
                Booked At
              </p>

              <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">
                {formatDate(booking.booked_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
