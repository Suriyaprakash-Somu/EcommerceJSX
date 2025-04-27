const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

exports.getAllUnits = (req, res) => {
  db.query("SELECT * FROM units", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPaginatedUnits = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS count FROM units", (err, countResult) => {
    if (err) return res.status(500).json({ error: err });

    const rowCount = countResult[0].count;

    db.query(
      "SELECT unit_id, unit_name, unit_abbreviation, unit_symbol, unit_id AS id FROM units LIMIT ? OFFSET ?",
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

exports.getUnitById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM units WHERE unit_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ error: "Unit not found" });
    res.json(results[0]);
  });
};

exports.createUnit = (req, res) => {
  const { unit_name, unit_abbreviation, unit_symbol } = req.body;
  db.query(
    "INSERT INTO units (unit_name, unit_abbreviation, unit_symbol) VALUES (?, ?, ?)",
    [unit_name, unit_abbreviation, unit_symbol],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      res.status(201).json({
        message: "Unit created successfully!",
        unitId: results.insertId,
      });
    }
  );
};

exports.updateUnit = (req, res) => {
  const { id } = req.params;
  const { unit_name, unit_abbreviation, unit_symbol } = req.body;

  db.query(
    "UPDATE units SET unit_name = ?, unit_abbreviation = ?, unit_symbol = ? WHERE unit_id = ?",
    [unit_name, unit_abbreviation, unit_symbol, id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Unit not found." });
      }

      res.json({ message: "Unit updated successfully." });
    }
  );
};

exports.deleteUnit = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM units WHERE unit_id = ?", [id], (err, results) => {
    if (err) return handleDatabaseError(res, err);

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Unit not found or already deleted." });
    }

    res.json({ message: "Unit deleted successfully." });
  });
};
