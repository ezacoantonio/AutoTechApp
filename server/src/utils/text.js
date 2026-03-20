export const sanitizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

export const sanitizeStringArray = (value) =>
  Array.isArray(value)
    ? [...new Set(value.map((item) => sanitizeText(item)).filter(Boolean))]
    : [];

export const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
