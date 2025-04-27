const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

// Get all departments
exports.getAllDepartments = (req, res) => {
  db.query("SELECT * FROM departments WHERE is_active = 1", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get paginated departments
exports.getPaginatedDepartments = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT COUNT(*) AS count FROM departments WHERE is_active = 1",
    (err, countResult) => {
      if (err) return res.status(500).json({ error: err });

      const rowCount = countResult[0].count;

      db.query(
        "SELECT department_id, department_name, is_active, department_description, department_id AS id FROM departments WHERE is_active = 1 LIMIT ? OFFSET ?",
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

// Get department by ID
exports.getDepartmentById = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM departments WHERE department_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ error: "Department not found" });
      res.json(results[0]);
    }
  );
};

// Create department
exports.createDepartment = (req, res) => {
  const { department_name, department_description } = req.body;
  db.query(
    "INSERT INTO departments (department_name, department_description) VALUES (?, ?)",
    [department_name, department_description],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      res.status(201).json({
        message: "Department created successfully!",
        departmentId: results.insertId,
      });
    }
  );
};

// Update department
exports.updateDepartment = (req, res) => {
  const { id } = req.params;
  const { department_name, department_description } = req.body;

  db.query(
    "UPDATE departments SET department_name = ?, department_description = ? WHERE department_id = ?",
    [department_name, department_description, id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Department not found." });
      }

      res.json({ message: "Department updated successfully." });
    }
  );
};

// Delete department
exports.deleteDepartment = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM departments WHERE department_id = ?",
    [id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Department not found or already deleted." });
      }

      res.json({ message: "Department deleted successfully." });
    }
  );
};
