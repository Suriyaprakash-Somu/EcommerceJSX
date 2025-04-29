// controllers/private/common/roles.js

import { db } from "../../../config/db.js";
import { roles } from "../../../schema/roles.js";
import { eq, count } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

// GET /roles
export async function getAllRoles(req, res) {
  try {
    const rows = await db.select().from(roles).where(eq(roles.isActive, 1)); // use roles.isActive
    return res.json(rows);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// GET /roles/paginated
export async function getPaginatedRoles(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // total count
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(roles)
      .where(eq(roles.isActive, 1)); // use roles.isActive

    const rowCount = Number(rawCount);

    // page of rows
    const rows = await db
      .select({
        role_id: roles.roleId, // ← correct
        role_name: roles.roleName, // ← correct
        is_active: roles.isActive, // ← correct
        role_description: roles.roleDescription, // ← correct
        id: roles.roleId, // ← correct
      })
      .from(roles)
      .where(eq(roles.isActive, 1)) // ← correct
      .limit(limit)
      .offset(offset);

    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// GET /roles/:id
export async function getRoleById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [role] = await db.select().from(roles).where(eq(roles.roleId, id)); // ← use roles.roleId

    if (!role) return res.status(404).json({ error: "Role not found" });
    return res.json(role);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// POST /roles
export async function createRole(req, res) {
  const { role_name, role_description } = req.body;
  try {
    const result = await db
      .insert(roles)
      .values({
        roleName: role_name,
        roleDescription: role_description,
      })
      .execute();

    return res.status(201).json({
      message: "Role created successfully!",
      roleId: result.insertId,
    });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// PUT /roles/:id
export async function updateRole(req, res) {
  const id = parseInt(req.params.id, 10);
  const { role_name, role_description } = req.body;
  try {
    const result = await db
      .update(roles)
      .set({
        roleName: role_name,
        roleDescription: role_description,
      })
      .where(eq(roles.roleId, id)) // ← use roles.roleId
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.json({ message: "Role updated successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

// DELETE /roles/:id
export async function deleteRole(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db
      .delete(roles)
      .where(eq(roles.roleId, id)) // ← use roles.roleId
      .execute();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Role not found." });
    }
    return res.json({ message: "Role deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
