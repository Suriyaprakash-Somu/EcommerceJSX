const express = require("express");
const router = express.Router();
const categoriesController = require("../../../controllers/private/product/category");

// List all categories (flat)
router.get("/all", categoriesController.getAllCategories);

// Get paginated list of categories
router.get("/paginated", categoriesController.getPaginatedCategories);

// Get tree structure (for TreeManager)
router.get("/tree", categoriesController.getCategoryTree);

// Get one category by ID
router.get("/:id", categoriesController.getCategoryById);

// Create a new category
router.post("/", categoriesController.createCategory);

// Update an existing category
router.put("/:id", categoriesController.updateCategory);

// Delete a category
router.delete("/:id", categoriesController.deleteCategory);

module.exports = router;
