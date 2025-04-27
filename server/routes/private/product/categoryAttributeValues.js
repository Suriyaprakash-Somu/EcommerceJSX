const express = require("express");
const router = express.Router();
const categoryAttributeValuesController = require("../../../controllers/private/product/categoryAttributeValues");

router.get(
  "/",
  categoryAttributeValuesController.getAllCategoryAttributeValues
);
router.get(
  "/paginated",
  categoryAttributeValuesController.getPaginatedCategoryAttributeValues
);
router.get(
  "/:id",
  categoryAttributeValuesController.getCategoryAttributeValueById
);
router.post(
  "/",
  categoryAttributeValuesController.createCategoryAttributeValue
);
router.put(
  "/:id",
  categoryAttributeValuesController.updateCategoryAttributeValue
);
router.delete(
  "/:id",
  categoryAttributeValuesController.deleteCategoryAttributeValue
);

module.exports = router;
