import pool from "../../config/db.js";

export const getDashboardStats = async ({ userId, role }) => {
  const leadValues = [];
  let leadCondition = "";

  if (role === "SALES") {
    leadValues.push(userId);

    leadCondition = `
      WHERE assigned_to = $${leadValues.length}
    `;
  }

  const leadResult = await pool.query(
    `
      SELECT
        COUNT(*) AS total,

        COUNT(*) FILTER (
          WHERE stage = 'NEW'
        ) AS new,

        COUNT(*) FILTER (
          WHERE stage = 'CONTACTED'
        ) AS contacted,

        COUNT(*) FILTER (
          WHERE stage = 'SITE_VISIT'
        ) AS site_visits,

        COUNT(*) FILTER (
          WHERE stage = 'INTERESTED'
        ) AS interested,

        COUNT(*) FILTER (
          WHERE stage = 'NEGOTIATION'
        ) AS negotiation,

        COUNT(*) FILTER (
          WHERE stage = 'BOOKED'
        ) AS booked,

        COUNT(*) FILTER (
          WHERE stage = 'LOST'
        ) AS lost

      FROM leads

      ${leadCondition}
    `,
    leadValues,
  );

  const bookingValues = [];
  let bookingCondition = "";

  if (role === "SALES") {
    bookingValues.push(userId);

    bookingCondition = `
      WHERE booked_by = $${bookingValues.length}
    `;
  }

  const bookingResult = await pool.query(
    `
      SELECT
        COUNT(*) AS total,

        COALESCE(
          SUM(amount),
          0
        ) AS total_value

      FROM bookings

      ${bookingCondition}
    `,
    bookingValues,
  );

  const unitResult = await pool.query(
    `
      SELECT

        COUNT(*) FILTER (
          WHERE status = 'AVAILABLE'
        ) AS available,

        COUNT(*) FILTER (
          WHERE status = 'BOOKED'
        ) AS booked,

        COUNT(*) FILTER (
          WHERE status = 'BLOCKED'
        ) AS blocked

      FROM units
    `,
  );

  const followUpValues = [];
  let followUpCondition = "";

  if (role === "SALES") {
    followUpValues.push(userId);

    followUpCondition = `
      AND l.assigned_to = $${followUpValues.length}
    `;
  }

  const followUpResult = await pool.query(
    `
      SELECT

        COUNT(*) FILTER (
          WHERE DATE(f.scheduled_at) = CURRENT_DATE
          AND f.status = 'PENDING'
        ) AS today,

        COUNT(*) FILTER (
          WHERE f.status = 'PENDING'
        ) AS pending

      FROM follow_ups f

      INNER JOIN leads l
        ON l.id = f.lead_id

      WHERE 1 = 1

      ${followUpCondition}
    `,
    followUpValues,
  );

  return {
    leads: leadResult.rows[0],
    bookings: bookingResult.rows[0],
    units: unitResult.rows[0],
    followUps: followUpResult.rows[0],
  };
};
