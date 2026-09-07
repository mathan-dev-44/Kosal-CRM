import {
  createNewBooking,
  getBookings,
  getBooking,
} from "./bookings.service.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await createNewBooking({
      leadId: req.body.leadId,
      unitId: req.body.unitId,
      amount: req.body.amount,
      user: req.user,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);

    if (
      error.message === "Lead not found" ||
      error.message === "Unit not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "You do not have access to this lead") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Unit is not available for booking") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await getBookings(req.user);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await getBooking(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error.message);

    if (error.message === "Booking not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "You do not have access to this booking") {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};
