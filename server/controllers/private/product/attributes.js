// controllers/private/product/attributes.js

import { db } from "../../../config/db.js";
import { attributes } from "../../../schema/attributes.js";
import { eq, count } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

// GET /attributes/all
export async function getAllAttributes(req, res) {
  try {
    const rows = await db.select().from(attributes);
    return res.json(rows);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// GET /attributes/paginated?page=1&limit=10
export async function getPaginatedAttributes(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // total count
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(attributes);
    const rowCount = Number(rawCount);

    // page of rows
    const rows = await db
      .select({
        attribute_id: attributes.attributeId,
        attribute_name: attributes.attributeName,
        input_type: attributes.inputType,
        id: attributes.attributeId, // alias
      })
      .from(attributes)
      .limit(limit)
      .offset(offset);

    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// GET /attributes/:id
export async function getAttributeById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [attr] = await db
      .select()
      .from(attributes)
      .where(eq(attributes.attributeId, id));

    if (!attr) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    return res.json(attr);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// POST /attributes
export async function createAttribute(req, res) {
  const { attribute_name, input_type } = req.body;
  try {
    const result = await db
      .insert(attributes)
      .values({
        attributeName: attribute_name,
        inputType: input_type,
      })
      .execute();

    return res.status(201).json({
      message: "Attribute created successfully!",
      attributeId: result.insertId,
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// PUT /attributes/:id
export async function updateAttribute(req, res) {
  const id = parseInt(req.params.id, 10);
  const { attribute_name, input_type } = req.body;
  try {
    const result = await db
      .update(attributes)
      .set({
        attributeName: attribute_name,
        inputType: input_type,
      })
      .where(eq(attributes.attributeId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attribute not found." });
    }
    return res.json({ message: "Attribute updated successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// DELETE /attributes/:id
export async function deleteAttribute(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db
      .delete(attributes)
      .where(eq(attributes.attributeId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attribute not found." });
    }
    return res.json({ message: "Attribute deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
