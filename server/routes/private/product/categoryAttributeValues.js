// routes/private/product/categoryAttributeValues.js

import express from "express";
import {
  getAllCategoryAttributeValues,
  getCategoryAttributeValueById,
  getPaginatedCategoryAttributeValues,
  createCategoryAttributeValue,
  updateCategoryAttributeValue,
  deleteCategoryAttributeValue,
} from "../../../controllers/private/product/categoryAttributeValues.js";

const router = express.Router();

router.get("/all", getAllCategoryAttributeValues);
router.get("/paginated", getPaginatedCategoryAttributeValues);
router.get("/:id", getCategoryAttributeValueById);
router.post("/", createCategoryAttributeValue);
router.put("/:id", updateCategoryAttributeValue);
router.delete("/:id", deleteCategoryAttributeValue);

export default router;
