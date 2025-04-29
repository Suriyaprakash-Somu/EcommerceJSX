// controllers/private/common/units.js

import { db } from "../../../config/db.js";
import { units } from "../../../schema/units.js";
import { eq, count } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

export async function getAllUnits(req, res) {
  try {
    const rows = await db.select().from(units);
    return res.json(rows);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getPaginatedUnits(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(units);
    const rowCount = Number(rawCount);

    const rows = await db
      .select({
        unit_id: units.unitId,
        unit_name: units.unitName,
        unit_abbreviation: units.unitAbbreviation,
        unit_symbol: units.unitSymbol,
        id: units.unitId,
      })
      .from(units)
      .limit(limit)
      .offset(offset);

    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getUnitById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [unit] = await db.select().from(units).where(eq(units.unitId, id));

    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    return res.json(unit);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function createUnit(req, res) {
  const { unit_name, unit_abbreviation, unit_symbol } = req.body;
  try {
    const result = await db
      .insert(units)
      .values({
        unitName: unit_name,
        unitAbbreviation: unit_abbreviation,
        unitSymbol: unit_symbol,
      })
      .execute();

    return res.status(201).json({
      message: "Unit created successfully!",
      unitId: result.insertId,
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function updateUnit(req, res) {
  const id = parseInt(req.params.id, 10);
  const { unit_name, unit_abbreviation, unit_symbol } = req.body;
  try {
    const result = await db
      .update(units)
      .set({
        unitName: unit_name,
        unitAbbreviation: unit_abbreviation,
        unitSymbol: unit_symbol,
      })
      .where(eq(units.unitId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found." });
    }
    return res.json({ message: "Unit updated successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function deleteUnit(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.delete(units).where(eq(units.unitId, id)).execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Unit not found." });
    }
    return res.json({ message: "Unit deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
