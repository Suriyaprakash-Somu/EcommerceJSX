// routes/private/product/attributes.js

import express from "express";
import {
  getAllAttributes,
  getPaginatedAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "../../../controllers/private/product/attributes.js";

const router = express.Router();

router.get("/all", getAllAttributes);
router.get("/paginated", getPaginatedAttributes);
router.get("/:id", getAttributeById);
router.post("/", createAttribute);
router.put("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

export default router;
