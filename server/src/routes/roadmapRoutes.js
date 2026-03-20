import { Router } from "express";
import { getRoadmap } from "../controllers/roadmapController.js";

const router = Router();

router.get("/", getRoadmap);

export default router;
