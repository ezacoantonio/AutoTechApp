import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  listCategories,
  restoreCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.route("/").get(listCategories).post(createCategory);
router.route("/:id").delete(deleteCategory);
router.route("/:id/restore").post(restoreCategory);

export default router;

