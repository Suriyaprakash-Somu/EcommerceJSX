const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

exports.getAllAttributeValues = (req, res) => {
  db.query("SELECT * FROM attribute_values", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPaginatedAttributeValues = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT COUNT(*) AS count FROM attribute_values",
    (err, countResult) => {
      if (err) return res.status(500).json({ error: err });

      const rowCount = countResult[0].count;

      db.query(
        "SELECT value_id, attribute_id, value_text, unit_id, value_id AS id FROM attribute_values LIMIT ? OFFSET ?",
        [limit, offset],
        (err, results) => {
          if (err) return res.status(500).json({ error: err });

          res.json({
            rows: results,
            rowCount: rowCount,
          });
        }
      );
    }
  );
};

exports.getAttributeValueById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM attribute_values WHERE value_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Attribute Value not found" });
      res.json(results[0]);
    }
  );
};

exports.createAttributeValue = (req, res) => {
  const { attribute_id, value_text, unit_id } = req.body;
  db.query(
    "INSERT INTO attribute_values (attribute_id, value_text, unit_id) VALUES (?, ?, ?)",
    [attribute_id, value_text, unit_id || null],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      res.status(201).json({
        message: "Attribute Value created successfully!",
        valueId: results.insertId,
      });
    }
  );
};

exports.updateAttributeValue = (req, res) => {
  const { id } = req.params;
  const { attribute_id, value_text, unit_id } = req.body;

  db.query(
    "UPDATE attribute_values SET attribute_id = ?, value_text = ?, unit_id = ? WHERE value_id = ?",
    [attribute_id, value_text, unit_id || null, id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Attribute Value not found." });
      }

      res.json({ message: "Attribute Value updated successfully." });
    }
  );
};

exports.deleteAttributeValue = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM attribute_values WHERE value_id = ?",
    [id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Attribute Value not found or already deleted." });
      }

      res.json({ message: "Attribute Value deleted successfully." });
    }
  );
};
