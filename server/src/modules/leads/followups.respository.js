import pool from "../../config/db.js";

export const createFollowUp = async ({ leadId, scheduledAt, remarks }) => {
  const result = await pool.query(
    `
      INSERT INTO follow_ups (
        lead_id,
        scheduled_at,
        remarks
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        lead_id,
        scheduled_at,
        status,
        remarks,
        created_at,
        updated_at
    `,
    [leadId, scheduledAt, remarks],
  );

  return result.rows[0];
};

export const findFollowUpsByLeadId = async (leadId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        lead_id,
        scheduled_at,
        status,
        remarks,
        created_at,
        updated_at
      FROM follow_ups
      WHERE lead_id = $1
      ORDER BY scheduled_at ASC
    `,
    [leadId],
  );

  return result.rows;
};

export const findFollowUpById = async (followUpId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        lead_id,
        scheduled_at,
        status,
        remarks,
        created_at,
        updated_at
      FROM follow_ups
      WHERE id = $1
      LIMIT 1
    `,
    [followUpId],
  );

  return result.rows[0] || null;
};

export const updateFollowUp = async (
  followUpId,
  { scheduledAt, status, remarks },
) => {
  const result = await pool.query(
    `
      UPDATE follow_ups
      SET
        scheduled_at = COALESCE($1, scheduled_at),
        status = COALESCE($2, status),
        remarks = COALESCE($3, remarks),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING
        id,
        lead_id,
        scheduled_at,
        status,
        remarks,
        created_at,
        updated_at
    `,
    [scheduledAt, status, remarks, followUpId],
  );

  return result.rows[0] || null;
};
