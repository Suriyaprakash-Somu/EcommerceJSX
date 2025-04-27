const express = require("express");
const router = express.Router();
const unitsController = require("../../../controllers/private/product/units");

router.get("/all", unitsController.getAllUnits);

router.get("/paginated", unitsController.getPaginatedUnits);

router.get("/:id", unitsController.getUnitById);

router.post("/", unitsController.createUnit);

router.put("/:id", unitsController.updateUnit);

router.delete("/:id", unitsController.deleteUnit);

module.exports = router;
