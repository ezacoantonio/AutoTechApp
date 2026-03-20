import { Router } from "express";
import { signCloudinaryUpload } from "../controllers/uploadController.js";

const router = Router();

router.post("/cloudinary-signature", signCloudinaryUpload);

export default router;
