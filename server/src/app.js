import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import healthRoutes from "./routes/healthRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import caseNoteRoutes from "./routes/caseNoteRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import notebookRoutes from "./routes/notebookRoutes.js";
import recentlyDeletedRoutes from "./routes/recentlyDeletedRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS ||
  process.env.CORS_ORIGIN ||
  defaultOrigins.join(",")
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    const error = new Error(`Origin ${origin} is not allowed by CORS.`);
    error.statusCode = 403;
    callback(error);
  },
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Mechanic Mindset API is running.",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/case-notes", caseNoteRoutes);
app.use("/api/notebooks", notebookRoutes);
app.use("/api/recently-deleted", recentlyDeletedRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
