import express from "express";
import {getAllDepartments,getPaginatedDepartments,getDepartmentById,createDepartment,updateDepartment,deleteDepartment} from "../../../controllers/private/common/departments.js";

const router = express.Router();

router.get("/",    getAllDepartments);
router.get("/paginated", getPaginatedDepartments);
router.get("/:id", getDepartmentById);
router.post("/",   createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
