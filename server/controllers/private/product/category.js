const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

// Get all categories
exports.getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get paginated categories
exports.getPaginatedCategories = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS count FROM categories", (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const rowCount = countResult[0].count;

    db.query(
      "SELECT category_id, category_name, category_description, category_image, category_url, parent_id FROM categories LIMIT ? OFFSET ?",
      [limit, offset],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
          rows: results,
          rowCount: rowCount,
        });
      }
    );
  });
};

// Get category by ID
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM categories WHERE category_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Category not found" });
      res.json(results[0]);
    }
  );
};

// Create category
exports.createCategory = (req, res) => {
  const {
    category_name,
    category_description,
    category_image,
    category_url,
    parent_id,
  } = req.body;

  db.query(
    "INSERT INTO categories (category_name, category_description, category_image, category_url, parent_id) VALUES (?, ?, ?, ?, ?)",
    [
      category_name,
      category_description,
      category_image,
      category_url,
      parent_id || null,
    ],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      res.status(201).json({
        message: "Category created successfully!",
        categoryId: results.insertId,
      });
    }
  );
};

// Update category
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const {
    category_name,
    category_description,
    category_image,
    category_url,
    parent_id,
  } = req.body;

  db.query(
    "UPDATE categories SET category_name = ?, category_description = ?, category_image = ?, category_url = ?, parent_id = ? WHERE category_id = ?",
    [
      category_name,
      category_description,
      category_image,
      category_url,
      parent_id || null,
      id,
    ],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found." });
      }

      res.json({ message: "Category updated successfully." });
    }
  );
};

// Delete category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM categories WHERE category_id = ?",
    [id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Category not found or already deleted." });
      }

      res.json({ message: "Category deleted successfully." });
    }
  );
};

// ✅ Get Tree Structure
exports.getCategoryTree = (req, res) => {
  const buildTree = (categories, parentId = null) => {
    const tree = [];
    categories.forEach((category) => {
      if (category.parent_id === parentId) {
        const children = buildTree(categories, category.category_id);
        if (children.length) {
          category.children = children;
        } else {
          category.children = [];
        }
        tree.push(category);
      }
    });
    return tree;
  };

  db.query(
    "SELECT category_id, category_name, category_description, category_image, category_url, parent_id FROM categories",
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      const tree = buildTree(results);
      res.json(tree);
    }
  );
};
