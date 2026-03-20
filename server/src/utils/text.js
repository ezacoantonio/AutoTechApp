export const sanitizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

export const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

