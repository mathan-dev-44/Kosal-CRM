import pool from "../../config/db.js";

export const createProject = async ({
  name,
  description,
  location,
  imageUrl,
}) => {
  const result = await pool.query(
    `
      INSERT INTO projects (
        name,
        description,
        location,
        image_url
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        description,
        location,
        image_url,
        created_at,
        updated_at
    `,
    [name, description, location, imageUrl],
  );

  return result.rows[0];
};

export const findAllProjects = async ({ page = 1, limit = 10 }) => {
  const countResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM projects
    `,
  );

  const total = Number(countResult.rows[0].total);

  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
      SELECT
        id,
        name,
        description,
        location,
        image_url,
        created_at,
        updated_at
      FROM projects
      ORDER BY created_at DESC
        LIMIT $1
      OFFSET $2
    `,
    [limit, offset],
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const findProjectById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        description,
        location,
        image_url,
        created_at,
        updated_at
      FROM projects
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};

export const updateProject = async (
  id,
  { name, description, location, imageUrl },
) => {
  const result = await pool.query(
    `
      UPDATE projects
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        location = COALESCE($3, location),
        image_url = COALESCE($4, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING
        id,
        name,
        description,
        location,
        image_url,
        created_at,
        updated_at
    `,
    [name, description, location, imageUrl, id],
  );

  return result.rows[0] || null;
};

export const deleteProject = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM projects
      WHERE id = $1
      RETURNING
        id,
        name,
        description,
        location
    `,
    [id],
  );

  return result.rows[0] || null;
};
