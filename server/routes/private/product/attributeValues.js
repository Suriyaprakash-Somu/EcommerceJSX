// routes/private/product/attributeValues.js

import express from "express";
import {
  getAllAttributeValues,
  getPaginatedAttributeValues,
  getAttributeValueById,
  createAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
} from "../../../controllers/private/product/attributeValues.js";

const router = express.Router();

router.get("/all", getAllAttributeValues);
router.get("/paginated", getPaginatedAttributeValues);
router.get("/:id", getAttributeValueById);
router.post("/", createAttributeValue);
router.put("/:id", updateAttributeValue);
router.delete("/:id", deleteAttributeValue);

export default router;
