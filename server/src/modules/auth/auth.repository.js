import pool from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password,
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

export const findUserById = async (id) => {
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
      WHERE id = $1
      LIMIT 1
    `,
    [id],
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
