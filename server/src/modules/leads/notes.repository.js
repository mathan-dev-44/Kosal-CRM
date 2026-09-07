import pool from "../../config/db.js";

export const createNote = async ({ leadId, content }) => {
  const result = await pool.query(
    `
      INSERT INTO lead_notes (
        lead_id,
        content
      )
      VALUES ($1, $2)
      RETURNING
        id,
        lead_id,
        content,
        created_at
    `,
    [leadId, content],
  );

  return result.rows[0];
};

export const findNotesByLeadId = async (leadId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        lead_id,
        content,
        created_at
      FROM lead_notes
      WHERE lead_id = $1
      ORDER BY created_at DESC
    `,
    [leadId],
  );

  return result.rows;
};

export const findNoteById = async (noteId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        lead_id,
        content,
        created_at
      FROM lead_notes
      WHERE id = $1
      LIMIT 1
    `,
    [noteId],
  );

  return result.rows[0] || null;
};

export const deleteNote = async (noteId) => {
  const result = await pool.query(
    `
      DELETE FROM lead_notes
      WHERE id = $1
      RETURNING
        id,
        lead_id,
        content,
        created_at
    `,
    [noteId],
  );

  return result.rows[0] || null;
};
