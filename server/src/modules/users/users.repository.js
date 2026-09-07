import pool from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] || null;
};

export const createUser = async ({ name, email, password, role }) => {
  const result = await pool.query(
    `
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        email,
        role,
        created_at,
        updated_at
    `,
    [name, email, password, role],
  );

  return result.rows[0];
};

export const findAllUsers = async ({ page = 1, limit = 10 }) => {
  const countResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM users
    `,
  );

  const total = Number(countResult.rows[0].total);

  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
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
