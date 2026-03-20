import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    app: "Mechanic Mindset API",
    timestamp: new Date().toISOString(),
  });
});

export default router;

