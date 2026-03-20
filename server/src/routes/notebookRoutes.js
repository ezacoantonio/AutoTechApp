import { Router } from "express";
import {
  createNotebook,
  deleteNotebook,
  getNotebookById,
  listNotebooks,
  updateNotebook,
} from "../controllers/notebookController.js";

const router = Router();

router.route("/").get(listNotebooks).post(createNotebook);
router.route("/:id").get(getNotebookById).put(updateNotebook).delete(deleteNotebook);

export default router;
