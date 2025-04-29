// routes/private/product/units.js

import express from "express";
import {
  getAllUnits,
  getPaginatedUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../../controllers/private/product/units.js";

const router = express.Router();

router.get("/all", getAllUnits);
router.get("/paginated", getPaginatedUnits);
router.get("/:id", getUnitById);
router.post("/", createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;
