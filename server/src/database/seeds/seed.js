import "dotenv/config";
import argon2 from "argon2";

import pool from "../../config/db.js";

const seed = async () => {
  try {
    console.log("🌱 Starting database seed...");

    const adminPassword = await argon2.hash("Admin@123");
    const salesPassword = await argon2.hash("Sales@123");

    await pool.query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          role
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `,
      ["CRM Admin", "admin@realestate.com", adminPassword, "ADMIN"],
    );

    await pool.query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          role
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `,
      ["Sales Employee", "sales@realestate.com", salesPassword, "SALES"],
    );

    console.log(" Seed completed successfully");

    console.log(" Admin: admin@realestate.com");
    console.log("Sales: sales@realestate.com");
  } catch (error) {
    console.error("Seed failed");
    console.error(error);
  } finally {
    await pool.end();
  }
};

seed();
