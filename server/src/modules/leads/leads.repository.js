import pool from "../../config/db.js";

export const createLead = async ({
  name,
  phone,
  email,
  source,
  stage,
  assignedTo,
}) => {
  const result = await pool.query(
    `
      INSERT INTO leads (
        name,
        phone,
        email,
        source,
        stage,
        assigned_to
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        name,
        phone,
        email,
        source,
        stage,
        assigned_to,
        created_at,
        updated_at
    `,
    [name, phone, email, source, stage, assignedTo],
  );

  return result.rows[0];
};

export const findLeadById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        l.id,
        l.name,
        l.phone,
        l.email,
        l.source,
        l.stage,
        l.assigned_to,
        l.created_at,
        l.updated_at,

        u.name AS assigned_user_name,
        u.email AS assigned_user_email

      FROM leads l

      LEFT JOIN users u
        ON u.id = l.assigned_to

      WHERE l.id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};

export const findLeads = async ({
  search,
  stage,
  assignedTo,
  page = 1,
  limit = 10,
}) => {
  const values = [];
  const conditions = [];

  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        l.name ILIKE $${values.length}
        OR l.phone ILIKE $${values.length}
        OR l.email ILIKE $${values.length}
      )
    `);
  }

  if (stage) {
    values.push(stage);

    conditions.push(`l.stage = $${values.length}`);
  }

  if (assignedTo) {
    values.push(assignedTo);

    conditions.push(`l.assigned_to = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM leads l
      ${whereClause}
    `,
    values,
  );

  const total = Number(countResult.rows[0].total);

  const offset = (page - 1) * limit;

  const paginationValues = [...values, limit, offset];

  const result = await pool.query(
    `
      SELECT
        l.id,
        l.name,
        l.phone,
        l.email,
        l.source,
        l.stage,
        l.assigned_to,
        l.created_at,
        l.updated_at,

        u.name AS assigned_user_name

      FROM leads l

      LEFT JOIN users u
        ON u.id = l.assigned_to

      ${whereClause}

      ORDER BY l.created_at DESC
            LIMIT $${paginationValues.length - 1}
      OFFSET $${paginationValues.length}
    `,
    paginationValues,
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

export const updateLead = async (id, { name, phone, email, source, stage }) => {
  const result = await pool.query(
    `
      UPDATE leads
      SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        email = COALESCE($3, email),
        source = COALESCE($4, source),
        stage = COALESCE($5, stage),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING
        id,
        name,
        phone,
        email,
        source,
        stage,
        assigned_to,
        created_at,
        updated_at
    `,
    [name, phone, email, source, stage, id],
  );

  return result.rows[0] || null;
};

export const assignLead = async (leadId, userId) => {
  const result = await pool.query(
    `
      UPDATE leads
      SET
        assigned_to = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        name,
        phone,
        email,
        source,
        stage,
        assigned_to,
        created_at,
        updated_at
    `,
    [userId, leadId],
  );

  return result.rows[0] || null;
};

export const deletedLead = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM leads
      WHERE id = $1
      RETURNING
        id,
        name,
        phone,
        email,
        source,
        stage,
        assigned_to,
        created_at,
        updated_at
    `,
    [id],
  );

  return result.rows[0] || null;
};
