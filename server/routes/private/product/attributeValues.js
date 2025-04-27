const express = require("express");
const router = express.Router();
const attributeValuesController = require("../../../controllers/private/product/attributeValues");

router.get("/", attributeValuesController.getAllAttributeValues);
router.get("/paginated", attributeValuesController.getPaginatedAttributeValues);
router.get("/:id", attributeValuesController.getAttributeValueById);
router.post("/", attributeValuesController.createAttributeValue);
router.put("/:id", attributeValuesController.updateAttributeValue);
router.delete("/:id", attributeValuesController.deleteAttributeValue);

module.exports = router;
