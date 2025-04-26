const express = require("express");
const router = express.Router();
const rolesController = require("../../controllers/private/roles");

router.get("/", rolesController.getAllRoles);

router.get("/paginated", rolesController.getPaginatedRoles);

router.get("/:id", rolesController.getRoleById);

router.post("/", rolesController.createRole);

router.put("/:id", rolesController.updateRole);

router.delete("/:id", rolesController.deleteRole);

module.exports = router;
