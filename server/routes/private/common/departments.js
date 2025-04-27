const express = require("express");
const router = express.Router();
const departmentsController = require("../../../controllers/private/common/departments"); // <-- departments controller

router.get("/", departmentsController.getAllDepartments);

router.get("/paginated", departmentsController.getPaginatedDepartments);

router.get("/:id", departmentsController.getDepartmentById);

router.post("/", departmentsController.createDepartment);

router.put("/:id", departmentsController.updateDepartment);

router.delete("/:id", departmentsController.deleteDepartment);

module.exports = router;
