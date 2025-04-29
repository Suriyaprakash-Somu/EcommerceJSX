import { db } from "../../../config/db.js";
import { attributeValues } from "../../../schema/attributeValues.js";
import { eq, count } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

export async function getAllAttributeValues(req, res) {
  try {
    const rows = await db.select().from(attributeValues);
    return res.json(rows);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getPaginatedAttributeValues(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(attributeValues);
    const rowCount = Number(rawCount);

    const rows = await db
      .select({
        value_id: attributeValues.valueId,
        attribute_id: attributeValues.attributeId,
        value_text: attributeValues.valueText,
        unit_id: attributeValues.unitId,
        id: attributeValues.valueId, // alias for front-end
      })
      .from(attributeValues)
      .limit(limit)
      .offset(offset);

    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getAttributeValueById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [row] = await db
      .select()
      .from(attributeValues)
      .where(eq(attributeValues.valueId, id));

    if (!row) {
      return res.status(404).json({ error: "Attribute Value not found" });
    }
    return res.json(row);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function createAttributeValue(req, res) {
  const { attribute_id, value_text, unit_id } = req.body;
  try {
    const result = await db
      .insert(attributeValues)
      .values({
        attributeId: attribute_id,
        valueText: value_text,
        unitId: unit_id ?? null,
      })
      .execute();

    return res.status(201).json({
      message: "Attribute Value created successfully!",
      valueId: result.insertId,
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function updateAttributeValue(req, res) {
  const id = parseInt(req.params.id, 10);
  const { attribute_id, value_text, unit_id } = req.body;
  try {
    const result = await db
      .update(attributeValues)
      .set({
        attributeId: attribute_id,
        valueText: value_text,
        unitId: unit_id ?? null,
      })
      .where(eq(attributeValues.valueId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attribute Value not found." });
    }
    return res.json({ message: "Attribute Value updated successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function deleteAttributeValue(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db
      .delete(attributeValues)
      .where(eq(attributeValues.valueId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attribute Value not found." });
    }
    return res.json({ message: "Attribute Value deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
