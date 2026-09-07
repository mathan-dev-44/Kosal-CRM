import pool from "../../config/db.js";

export const createBookingTransaction = async ({
  leadId,
  unitId,
  bookedBy,
  amount,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const unitResult = await client.query(
      `
        SELECT
          id,
          building_id,
          unit_number,
          type,
          price,
          status
        FROM units
        WHERE id = $1
        FOR UPDATE
      `,
      [unitId],
    );

    const unit = unitResult.rows[0];

    if (!unit) {
      throw new Error("Unit not found");
    }

    if (unit.status !== "AVAILABLE") {
      throw new Error("Unit is not available for booking");
    }

    const leadResult = await client.query(
      `
        SELECT
          id,
          name,
          stage,
          assigned_to
        FROM leads
        WHERE id = $1
        LIMIT 1
      `,
      [leadId],
    );

    const lead = leadResult.rows[0];

    if (!lead) {
      throw new Error("Lead not found");
    }

    const bookingResult = await client.query(
      `
        INSERT INTO bookings (
          lead_id,
          unit_id,
          booked_by,
          amount
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          lead_id,
          unit_id,
          booked_by,
          amount,
          booked_at,
          created_at,
          updated_at
      `,
      [leadId, unitId, bookedBy, amount],
    );

    const booking = bookingResult.rows[0];

    await client.query(
      `
        UPDATE units
        SET
          status = 'BOOKED',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [unitId],
    );

    await client.query(
      `
        UPDATE leads
        SET
          stage = 'BOOKED',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [leadId],
    );

    await client.query("COMMIT");

    return {
      booking,
      unit: {
        id: unit.id,
        unitNumber: unit.unit_number,
        type: unit.type,
        price: unit.price,
        status: "BOOKED",
      },
      lead: {
        id: lead.id,
        name: lead.name,
        stage: "BOOKED",
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const findAllBookings = async ({
  userId,
  role,
  page = 1,
  limit = 10,
}) => {
  const values = [];
  let userCondition = "";

  if (role === "SALES") {
    values.push(userId);
    userCondition = `WHERE b.booked_by = $${values.length}`;
  }

  const countResult = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM bookings b
      ${userCondition}
    `,
    values,
  );

  const total = Number(countResult.rows[0].total);

  const offset = (page - 1) * limit;

  const paginationValues = [...values, limit, offset];

  const result = await pool.query(
    `
      SELECT
        b.id,
        b.amount,
        b.booked_at,
        b.created_at,
        b.updated_at,

        -- Lead
        l.id AS lead_id,
        l.name AS lead_name,
        l.phone AS lead_phone,
        l.email AS lead_email,

        -- Unit
        u.id AS unit_id,
        u.unit_number,
        u.type AS unit_type,
        u.price AS unit_price,
        u.status AS unit_status,

        -- Building
        bl.id AS building_id,
        bl.name AS building_name,

        -- Project
        p.id AS project_id,
        p.name AS project_name,
        p.location AS project_location,

        -- Sales employee
        usr.id AS booked_by_id,
        usr.name AS booked_by_name,
        usr.email AS booked_by_email

      FROM bookings b

      INNER JOIN leads l
        ON l.id = b.lead_id

      INNER JOIN units u
        ON u.id = b.unit_id

      INNER JOIN buildings bl
        ON bl.id = u.building_id

      INNER JOIN projects p
        ON p.id = bl.project_id

      INNER JOIN users usr
        ON usr.id = b.booked_by

      ${userCondition}

      ORDER BY b.booked_at DESC
      
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

export const findBookingById = async (id) => {
  const result = await pool.query(
    `
      SELECT
        b.id,
        b.amount,
        b.booked_at,
        b.created_at,
        b.updated_at,

        -- Lead
        l.id AS lead_id,
        l.name AS lead_name,
        l.phone AS lead_phone,
        l.email AS lead_email,
        l.stage AS lead_stage,

        -- Unit
        u.id AS unit_id,
        u.unit_number,
        u.type AS unit_type,
        u.price AS unit_price,
        u.status AS unit_status,

        -- Building
        bl.id AS building_id,
        bl.name AS building_name,

        -- Project
        p.id AS project_id,
        p.name AS project_name,
        p.location AS project_location,
        p.image_url AS project_image_url,

        -- Sales employee
        usr.id AS booked_by_id,
        usr.name AS booked_by_name,
        usr.email AS booked_by_email

      FROM bookings b

      INNER JOIN leads l
        ON l.id = b.lead_id

      INNER JOIN units u
        ON u.id = b.unit_id

      INNER JOIN buildings bl
        ON bl.id = u.building_id

      INNER JOIN projects p
        ON p.id = bl.project_id

      INNER JOIN users usr
        ON usr.id = b.booked_by

      WHERE b.id = $1

      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] || null;
};
