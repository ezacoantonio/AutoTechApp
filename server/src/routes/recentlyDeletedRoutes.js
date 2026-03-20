import { Router } from "express";
import { listRecentlyDeleted } from "../controllers/recentlyDeletedController.js";

const router = Router();

router.get("/", listRecentlyDeleted);

export default router;

