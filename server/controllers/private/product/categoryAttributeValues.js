const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

exports.getAllCategoryAttributeValues = (req, res) => {
  db.query("SELECT * FROM category_attribute_values", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPaginatedCategoryAttributeValues = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT COUNT(*) AS count FROM category_attribute_values",
    (err, countResult) => {
      if (err) return res.status(500).json({ error: err });

      const rowCount = countResult[0].count;

      db.query(
        `SELECT cav.category_id, cav.attribute_id, cav.value_id, cav.id,
                c.category_name, a.attribute_name, av.value_text
         FROM category_attribute_values cav
         JOIN categories c ON cav.category_id = c.category_id
         JOIN attributes a ON cav.attribute_id = a.attribute_id
         JOIN attribute_values av ON cav.value_id = av.value_id
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, results) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ rows: results, rowCount });
        }
      );
    }
  );
};

exports.getCategoryAttributeValueById = (req, res) => {
  const { category_id, attribute_id, value_id } = req.params;
  db.query(
    `SELECT * FROM category_attribute_values 
     WHERE category_id = ? AND attribute_id = ? AND value_id = ?`,
    [category_id, attribute_id, value_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Mapping not found" });
      res.json(results[0]);
    }
  );
};

exports.createCategoryAttributeValue = (req, res) => {
  const { category_id, attribute_id, value_id } = req.body;
  db.query(
    "INSERT INTO category_attribute_values (category_id, attribute_id, value_id) VALUES (?, ?, ?)",
    [category_id, attribute_id, value_id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);
      res.status(201).json({
        message: "Mapping created successfully!",
      });
    }
  );
};

exports.updateCategoryAttributeValue = (req, res) => {
  const { id } = req.params;
  const { category_id, attribute_id, value_id } = req.body;

  db.query(
    `UPDATE category_attribute_values
     SET category_id = ?, attribute_id = ?, value_id = ?
     WHERE id = ?`,
    [category_id, attribute_id, value_id, id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Mapping not found." });
      }
      res.json({ message: "Mapping updated successfully." });
    }
  );
};

exports.deleteCategoryAttributeValue = (req, res) => {
  const { id } = req.params;

  db.query(
    `DELETE FROM category_attribute_values 
     WHERE id = ?`,
    [id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);
      if (results.affectedRows === 0)
        return res
          .status(404)
          .json({ message: "Mapping not found or already deleted." });
      res.json({ message: "Mapping deleted successfully." });
    }
  );
};
