// routes/private/product/category.js

import express from "express";
import {
  getAllCategories,
  getPaginatedCategories,
  getCategoryById,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../controllers/private/product/category.js";

const router = express.Router();

router.get("/all", getAllCategories);
router.get("/paginated", getPaginatedCategories);
router.get("/tree", getCategoryTree);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
