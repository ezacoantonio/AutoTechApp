import crypto from "node:crypto";
import { createHttpError } from "../utils/http.js";
import { sanitizeText } from "../utils/text.js";

export const signCloudinaryUpload = async (req, res) => {
  const cloudName = sanitizeText(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = sanitizeText(process.env.CLOUDINARY_API_KEY);
  const apiSecret = sanitizeText(process.env.CLOUDINARY_API_SECRET);
  const folder =
    sanitizeText(req.body.folder) ||
    sanitizeText(process.env.CLOUDINARY_FOLDER) ||
    "mechanic-mindset";

  if (!cloudName || !apiKey || !apiSecret) {
    throw createHttpError(
      503,
      "Cloudinary is not configured on the server yet."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(`${paramsToSign}${apiSecret}`)
    .digest("hex");

  res.json({
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature,
  });
};

