import pool from "../../config/db.js";

export const createUnit = async ({
  buildingId,
  unitNumber,
  type,
  price,
  status,
}) => {
  const result = await pool.query(
    `
      INSERT INTO units (
        building_id,
        unit_number,
        type,
        price,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        building_id,
        unit_number,
        type,
        price,
        status,
        created_at,
        updated_at
    `,
    [buildingId, unitNumber, type, price, status],
  );

  return result.rows[0];
};

export const findUnitsByBuildingId = async (
  buildingId,
  { status, type } = {},
) => {
  const values = [buildingId];
  const conditions = ["building_id = $1"];

  if (status) {
    values.push(status);

    conditions.push(`status = $${values.length}`);
  }

  if (type) {
    values.push(type);

    conditions.push(`type = $${values.length}`);
  }

  const result = await pool.query(
    `
      SELECT
        id,
        building_id,
        unit_number,
        type,
        price,
        status,
        created_at,
        updated_at
      FROM units
      WHERE ${conditions.join(" AND ")}
      ORDER BY unit_number ASC
    `,
    values,
  );

  return result.rows;
};

export const findUnitById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        id,
        building_id,
        unit_number,
        type,
        price,
        status,
        created_at,
        updated_at
      FROM units
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};

export const updateUnit = async (id, { unitNumber, type, price, status }) => {
  const result = await pool.query(
    `
      UPDATE units
      SET
        unit_number = COALESCE($1, unit_number),
        type = COALESCE($2, type),
        price = COALESCE($3, price),
        status = COALESCE($4, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING
        id,
        building_id,
        unit_number,
        type,
        price,
        status,
        created_at,
        updated_at
    `,
    [unitNumber, type, price, status, id],
  );

  return result.rows[0] || null;
};
