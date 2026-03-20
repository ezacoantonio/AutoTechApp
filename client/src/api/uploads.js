import { request } from "./http.js";

export async function uploadImageToCloudinary(file, folder = "mechanic-mindset/notebooks") {
  const signaturePayload = await request("/api/uploads/cloudinary-signature", {
    method: "POST",
    body: JSON.stringify({ folder }),
  });

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signaturePayload.apiKey);
  formData.append("timestamp", String(signaturePayload.timestamp));
  formData.append("signature", signaturePayload.signature);
  formData.append("folder", signaturePayload.folder);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message || "Cloudinary upload failed.");
  }

  return {
    url: payload.secure_url || payload.url || "",
    publicId: payload.public_id || "",
    width: payload.width || null,
    height: payload.height || null,
    format: payload.format || "",
    originalFilename: payload.original_filename || file.name || "",
  };
}
