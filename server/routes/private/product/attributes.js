const express = require("express");
const router = express.Router();
const attributesController = require("../../../controllers/private/product/attributes");

router.get("/all", attributesController.getAllAttributes);

router.get("/paginated", attributesController.getPaginatedAttributes);

router.get("/:id", attributesController.getAttributeById);

router.post("/", attributesController.createAttribute);

router.put("/:id", attributesController.updateAttribute);

router.delete("/:id", attributesController.deleteAttribute);

module.exports = router;
