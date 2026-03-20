import { Router } from "express";
import {
  createCaseNote,
  deleteCaseNote,
  getCaseNoteById,
  listCaseNotes,
  updateCaseNote,
} from "../controllers/caseNoteController.js";

const router = Router();

router.route("/").get(listCaseNotes).post(createCaseNote);
router.route("/:id").get(getCaseNoteById).put(updateCaseNote).delete(deleteCaseNote);

export default router;
