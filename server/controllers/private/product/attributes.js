const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

exports.getAllAttributes = (req, res) => {
  db.query("SELECT * FROM attributes", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPaginatedAttributes = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS count FROM attributes", (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const rowCount = countResult[0].count;

    db.query(
      "SELECT attribute_id, attribute_name, input_type, attribute_id AS id FROM attributes LIMIT ? OFFSET ?",
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

exports.getAttributeById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM attributes WHERE attribute_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Attribute not found" });
      res.json(results[0]);
    }
  );
};

exports.createAttribute = (req, res) => {
  const { attribute_name, input_type } = req.body;
  db.query(
    "INSERT INTO attributes (attribute_name, input_type) VALUES (?, ?)",
    [attribute_name, input_type],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      res.status(201).json({
        message: "Attribute created successfully!",
        attributeId: results.insertId,
      });
    }
  );
};

exports.updateAttribute = (req, res) => {
  const { id } = req.params;
  const { attribute_name, input_type } = req.body;

  db.query(
    "UPDATE attributes SET attribute_name = ?, input_type = ? WHERE attribute_id = ?",
    [attribute_name, input_type, id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Attribute not found." });
      }

      res.json({ message: "Attribute updated successfully." });
    }
  );
};

exports.deleteAttribute = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM attributes WHERE attribute_id = ?",
    [id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Attribute not found or already deleted." });
      }

      res.json({ message: "Attribute deleted successfully." });
    }
  );
};
