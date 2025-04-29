// controllers/private/product/categoryAttributeValues.js

import { db } from "../../../config/db.js";
import { categoryAttributeValues } from "../../../schema/categoryAttributeValues.js";
import { categories } from "../../../schema/categories.js";
import { attributes } from "../../../schema/attributes.js";
import { attributeValues } from "../../../schema/attributeValues.js";
import { eq, count } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

export async function getAllCategoryAttributeValues(req, res) {
  try {
    const rows = await db.select().from(categoryAttributeValues);
    return res.json(rows);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getPaginatedCategoryAttributeValues(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(categoryAttributeValues);
    const rowCount = Number(rawCount);

    const rows = await db
      .select({
        category_id: categoryAttributeValues.categoryId,
        attribute_id: categoryAttributeValues.attributeId,
        value_id: categoryAttributeValues.valueId,
        id: categoryAttributeValues.id,
        category_name: categories.categoryName,
        attribute_name: attributes.attributeName,
        value_text: attributeValues.valueText,
      })
      .from(categoryAttributeValues)
      .leftJoin(
        categories,
        eq(categoryAttributeValues.categoryId, categories.categoryId)
      )
      .leftJoin(
        attributes,
        eq(categoryAttributeValues.attributeId, attributes.attributeId)
      )
      .leftJoin(
        attributeValues,
        eq(categoryAttributeValues.valueId, attributeValues.valueId)
      )
      .limit(limit)
      .offset(offset);

    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getCategoryAttributeValueById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [row] = await db
      .select()
      .from(categoryAttributeValues)
      .where(eq(categoryAttributeValues.id, id));

    if (!row) {
      return res.status(404).json({ error: "Mapping not found" });
    }
    return res.json(row);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function createCategoryAttributeValue(req, res) {
  const { category_id, attribute_id, value_id } = req.body;
  try {
    await db
      .insert(categoryAttributeValues)
      .values({
        categoryId: category_id,
        attributeId: attribute_id,
        valueId: value_id,
      })
      .execute();

    return res.status(201).json({
      message: "Mapping created successfully!",
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function updateCategoryAttributeValue(req, res) {
  const id = parseInt(req.params.id, 10);
  const { category_id, attribute_id, value_id } = req.body;
  try {
    const result = await db
      .update(categoryAttributeValues)
      .set({
        categoryId: category_id,
        attributeId: attribute_id,
        valueId: value_id,
      })
      .where(eq(categoryAttributeValues.id, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mapping not found." });
    }
    return res.json({ message: "Mapping updated successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function deleteCategoryAttributeValue(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db
      .delete(categoryAttributeValues)
      .where(eq(categoryAttributeValues.id, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mapping not found." });
    }
    return res.json({ message: "Mapping deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
