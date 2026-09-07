import express from "express";

import {
  createBooking,
  getAllBookings,
  getBookingById,
} from "./bookings.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import { createBookingSchema } from "./bookings.validation.js";

const router = express.Router();

router.post("/", authenticate, validate(createBookingSchema), createBooking);

router.get("/", authenticate, getAllBookings);

router.get("/:id", authenticate, getBookingById);

export default router;
