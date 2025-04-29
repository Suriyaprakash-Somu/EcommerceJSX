// controllers/private/common/departments.js

import { db } from "../../../config/db.js";
import { departments } from "../../../schema/departments.js";
import { eq, count } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

/**
 * GET /departments
 */
export async function getAllDepartments(req, res) {
  try {
    const rows = await db
      .select()
      .from(departments)
      .where(eq(departments.isActive, 1)); // use the JS‐property isActive
    return res.json(rows); // will be [] if none
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

/**
 * GET /departments/paginated?page=1&limit=10
 */
export async function getPaginatedDepartments(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // total count of active
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(departments)
      .where(eq(departments.isActive, 1));

    const rowCount = Number(rawCount);

    // fetch page
    const rows = await db
      .select({
        department_id: departments.departmentId,
        department_name: departments.departmentName,
        is_active: departments.isActive,
        department_description: departments.departmentDescription,
        id: departments.departmentId, // alias for front end
      })
      .from(departments)
      .where(eq(departments.isActive, 1))
      .limit(limit)
      .offset(offset);

    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

/**
 * GET /departments/:id
 */
export async function getDepartmentById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [dept] = await db
      .select()
      .from(departments)
      .where(eq(departments.departmentId, id));

    if (!dept) {
      return res.status(404).json({ error: "Department not found" });
    }
    return res.json(dept);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

/**
 * POST /departments
 */
export async function createDepartment(req, res) {
  const { department_name, department_description } = req.body;
  try {
    const result = await db
      .insert(departments)
      .values({
        departmentName: department_name,
        departmentDescription: department_description,
      })
      .execute();

    return res.status(201).json({
      message: "Department created successfully!",
      departmentId: result.insertId,
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

/**
 * PUT /departments/:id
 */
export async function updateDepartment(req, res) {
  const id = parseInt(req.params.id, 10);
  const { department_name, department_description } = req.body;
  try {
    const result = await db
      .update(departments)
      .set({
        departmentName: department_name,
        departmentDescription: department_description,
      })
      .where(eq(departments.departmentId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found." });
    }
    return res.json({ message: "Department updated successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

/**
 * DELETE /departments/:id
 */
export async function deleteDepartment(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db
      .delete(departments)
      .where(eq(departments.departmentId, id))
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found." });
    }
    return res.json({ message: "Department deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
