const db = require("../../../config/db");
const { handleDatabaseError } = require("../../../utils/errorHandler");

exports.getAllRoles = (req, res) => {
  db.query("SELECT * FROM roles WHERE is_active = 1", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPaginatedRoles = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT COUNT(*) AS count FROM roles WHERE is_active = 1",
    (err, countResult) => {
      if (err) return res.status(500).json({ error: err });

      const rowCount = countResult[0].count;

      db.query(
        "SELECT role_id,role_name,is_active,role_description, role_id AS id FROM roles WHERE is_active = 1 LIMIT ? OFFSET ?",
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

exports.getRoleById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM roles WHERE role_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ error: "Role not found" });
    res.json(results[0]);
  });
};

exports.createRole = (req, res) => {
  const { role_name, role_description } = req.body;
  db.query(
    "INSERT INTO roles (role_name, role_description) VALUES (?, ?)",
    [role_name, role_description],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      res.status(201).json({
        message: "Role created successfully!",
        roleId: results.insertId,
      });
    }
  );
};

exports.updateRole = (req, res) => {
  const { id } = req.params;
  const { role_name, role_description } = req.body;

  db.query(
    "UPDATE roles SET role_name = ?, role_description = ? WHERE role_id = ?",
    [role_name, role_description, id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Role not found." });
      }

      res.json({ message: "Role updated successfully." });
    }
  );
};

exports.deleteRole = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM roles WHERE role_id = ?",
    [id],
    (err, results) => {
      if (err) return handleDatabaseError(res, err);

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Role not found or already deleted." });
      }

      res.json({ message: "Role deleted successfully." });
    }
  );
};


// exports.deleteRole = (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "UPDATE roles SET is_active = 0 WHERE role_id = ?",
//     [id],
//     (err, results) => {
//       if (err) return handleDatabaseError(res, err);

//       if (results.affectedRows === 0) {
//         return res
//           .status(404)
//           .json({ message: "Role not found or already deleted." });
//       }

//       res.json({ message: "Role deleted successfully." });
//     }
//   );
// };
