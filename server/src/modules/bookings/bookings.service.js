import { findLeadById } from "../leads/leads.repository.js";
import { findUnitById } from "../properties/units.repository.js";

import {
  createBookingTransaction,
  findAllBookings,
  findBookingById,
} from "./bookings.repository.js";

export const createNewBooking = async ({ leadId, unitId, amount, user }) => {
  const lead = await findLeadById(leadId);

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (user.role === "SALES" && lead.assigned_to !== user.userId) {
    throw new Error("You do not have access to this lead");
  }

  const unit = await findUnitById(unitId);

  if (!unit) {
    throw new Error("Unit not found");
  }

  if (unit.status !== "AVAILABLE") {
    throw new Error("Unit is not available for booking");
  }

  return await createBookingTransaction({
    leadId,
    unitId,
    bookedBy: user.userId,
    amount,
  });
};

export const getBookings = async (user) => {
  return await findAllBookings({
    userId: user.userId,
    role: user.role,
  });
};

export const getBooking = async (id, user) => {
  const booking = await findBookingById(id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (user.role === "SALES" && booking.booked_by_id !== user.userId) {
    throw new Error("You do not have access to this booking");
  }

  return booking;
};
