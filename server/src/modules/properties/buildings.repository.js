import pool from "../../config/db.js";

export const createBuilding = async ({ projectId, name }) => {
  const result = await pool.query(
    `
      INSERT INTO buildings (
        project_id,
        name
      )
      VALUES ($1, $2)
      RETURNING
        id,
        project_id,
        name,
        created_at,
        updated_at
    `,
    [projectId, name],
  );

  return result.rows[0];
};

export const findBuildingsByProjectId = async (projectId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        project_id,
        name,
        created_at,
        updated_at
      FROM buildings
      WHERE project_id = $1
      ORDER BY created_at ASC
    `,
    [projectId],
  );

  return result.rows;
};

export const findBuildingById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        project_id,
        name,
        created_at,
        updated_at
      FROM buildings
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};

export const updateBuilding = async (id, { name }) => {
  const result = await pool.query(
    `
      UPDATE buildings
      SET
        name = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        project_id,
        name,
        created_at,
        updated_at
    `,
    [name, id],
  );

  return result.rows[0] || null;
};

export const deleteBuilding = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM buildings
      WHERE id = $1
      RETURNING
        id,
        project_id,
        name
    `,
    [id],
  );

  return result.rows[0] || null;
};
