import express from "express";
import cors from "cors";
import pool from "./config/db.js";

import authRoutes from "./modules/auth/auth.route.js";
import usersRoutes from "./modules/users/users.route.js";
import leadsRoutes from "./modules/leads/leads.route.js";
import propertiesRoutes from "./modules/properties/properties.route.js";
import bookingsRoutes from "./modules/bookings/bookings.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Real Estate CRM API is healthy",
      database: "connected",
      serverTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/projects", propertiesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;
