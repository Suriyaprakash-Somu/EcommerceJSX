// controllers/private/product/category.js
import { db } from "../../../config/db.js";
import { categories } from "../../../schema/categories.js";
import { categoryClosure } from "../../../schema/categoryClosure.js";
import { eq, and, count, inArray, not } from "drizzle-orm";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

export async function getAllCategories(req, res) {
  try {
    const rows = await db.select().from(categories);
    return res.json(rows);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getPaginatedCategories(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  try {
    const [{ count: rawCount }] = await db
      .select({ count: count() })
      .from(categories);
    const rowCount = Number(rawCount);
    const rows = await db
      .select({
        category_id: categories.categoryId,
        category_name: categories.categoryName,
        category_description: categories.categoryDescription,
        category_image: categories.categoryImage,
        category_url: categories.categoryUrl,
        parent_id: categories.parentId,
        id: categories.categoryId,
      })
      .from(categories)
      .limit(limit)
      .offset(offset);
    return res.json({ rows, rowCount });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getCategoryById(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const [row] = await db
      .select()
      .from(categories)
      .where(eq(categories.categoryId, id));
    if (!row) return res.status(404).json({ error: "Category not found" });
    return res.json(row);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function createCategory(req, res) {
  const {
    category_name,
    category_description,
    category_image,
    category_url,
    parent_id,
  } = req.body;
  const parentId = parent_id ? parseInt(parent_id, 10) : null;

  try {
    await db.transaction(async (tx) => {
      const [insertResult] = await tx
        .insert(categories)
        .values({
          categoryName: category_name,
          categoryDescription: category_description,
          categoryImage: category_image,
          categoryUrl: category_url,
          parentId,
        })
        .execute();
      const newId = insertResult.insertId;

      // self‐link
      await tx
        .insert(categoryClosure)
        .values({
          ancestorId: newId,
          descendantId: newId,
          depth: 0,
        })
        .execute();

      if (parentId !== null) {
        const parentPaths = await tx
          .select({
            ancestorId: categoryClosure.ancestorId,
            depth: categoryClosure.depth,
          })
          .from(categoryClosure)
          .where(eq(categoryClosure.descendantId, parentId));

        for (const p of parentPaths) {
          await tx
            .insert(categoryClosure)
            .values({
              ancestorId: p.ancestorId,
              descendantId: newId,
              depth: p.depth + 1,
            })
            .execute();
        }
      }
    });

    return res.status(201).json({ message: "Category created successfully!" });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function updateCategory(req, res) {
  const id = parseInt(req.params.id, 10);
  const {
    category_name,
    category_description,
    category_image,
    category_url,
    parent_id,
  } = req.body;
  const newParentId = parent_id ? parseInt(parent_id, 10) : null;

  try {
    await db.transaction(async (tx) => {
      const [old] = await tx
        .select({ parentId: categories.parentId })
        .from(categories)
        .where(eq(categories.categoryId, id));
      if (!old) throw { status: 404 };

      await tx
        .update(categories)
        .set({
          categoryName: category_name,
          categoryDescription: category_description,
          categoryImage: category_image,
          categoryUrl: category_url,
          parentId: newParentId,
        })
        .where(eq(categories.categoryId, id))
        .execute();

      if ((old.parentId || null) !== newParentId) {
        const descs = await tx
          .select({
            d: categoryClosure.descendantId,
            depth: categoryClosure.depth,
          })
          .from(categoryClosure)
          .where(eq(categoryClosure.ancestorId, id));
        const descendantIds = descs.map((r) => r.d);

        await tx
          .delete(categoryClosure)
          .where(
            and(
              inArray(categoryClosure.descendantId, descendantIds),
              not(inArray(categoryClosure.ancestorId, descendantIds))
            )
          )
          .execute();

        if (newParentId !== null) {
          const newAncestors = await tx
            .select({
              ancestorId: categoryClosure.ancestorId,
              depth: categoryClosure.depth,
            })
            .from(categoryClosure)
            .where(eq(categoryClosure.descendantId, newParentId));

          for (const desc of descs) {
            for (const anc of newAncestors) {
              await tx
                .insert(categoryClosure)
                .values({
                  ancestorId: anc.ancestorId,
                  descendantId: desc.d,
                  depth: anc.depth + 1 + desc.depth,
                })
                .execute();
            }
          }
        }
      }
    });

    return res.json({ message: "Category updated successfully." });
  } catch (err) {
    if (err.status === 404)
      return res.status(404).json({ message: "Category not found." });
    return handleDatabaseError(res, err);
  }
}

export async function deleteCategory(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db
      .delete(categories)
      .where(eq(categories.categoryId, id))
      .execute();
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Category not found." });
    return res.json({ message: "Category deleted successfully." });
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getCategoryTree(req, res) {
  try {
    const rows = await db
      .select({
        category_id: categories.categoryId,
        category_name: categories.categoryName,
        category_description: categories.categoryDescription,
        category_image: categories.categoryImage,
        category_url: categories.categoryUrl,
        parent_id: categories.parentId,
      })
      .from(categories);

    const map = new Map();
    rows.forEach((r) => map.set(r.category_id, { ...r, children: [] }));
    const tree = [];
    map.forEach((node) => {
      if (node.parent_id == null) tree.push(node);
      else {
        const p = map.get(node.parent_id);
        if (p) p.children.push(node);
      }
    });
    return res.json(tree);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getCategoryDescendants(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const descendants = await db
      .select({
        category_id: categories.categoryId,
        category_name: categories.categoryName,
        depth: categoryClosure.depth,
      })
      .from(categoryClosure)
      .innerJoin(
        categories,
        eq(categoryClosure.descendantId, categories.categoryId)
      )
      .where(
        and(
          eq(categoryClosure.ancestorId, id),
          not(eq(categoryClosure.descendantId, id))
        )
      )
      .orderBy(categoryClosure.depth);
    return res.json(descendants);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}

export async function getCategoryAncestors(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const ancestors = await db
      .select({
        category_id: categories.categoryId,
        category_name: categories.categoryName,
        depth: categoryClosure.depth,
      })
      .from(categoryClosure)
      .innerJoin(
        categories,
        eq(categoryClosure.ancestorId, categories.categoryId)
      )
      .where(
        and(
          eq(categoryClosure.descendantId, id),
          not(eq(categoryClosure.ancestorId, id))
        )
      )
      .orderBy(categoryClosure.depth);
    return res.json(ancestors);
  } catch (err) {
    return handleDatabaseError(res, err);
  }
}
