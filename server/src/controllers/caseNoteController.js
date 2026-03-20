import CaseNote from "../models/CaseNote.js";

const sanitizeText = (value) => (typeof value === "string" ? value.trim() : "");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildCaseNotePayload = (body) => ({
  vehicle: sanitizeText(body.vehicle),
  problem: sanitizeText(body.problem),
  cause: sanitizeText(body.cause),
  fix: sanitizeText(body.fix),
  lessonLearned: sanitizeText(body.lessonLearned),
});

const validateCaseNotePayload = (payload) => {
  const errors = [];

  if (!payload.vehicle) errors.push("Vehicle is required.");
  if (!payload.problem) errors.push("Problem is required.");
  if (!payload.cause) errors.push("Cause is required.");
  if (!payload.fix) errors.push("Fix is required.");
  if (!payload.lessonLearned) errors.push("Lesson learned is required.");

  return errors;
};

export const listCaseNotes = async (req, res) => {
  const search = sanitizeText(req.query.search);
  const query = {};

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { vehicle: pattern },
      { problem: pattern },
      { cause: pattern },
      { fix: pattern },
      { lessonLearned: pattern },
    ];
  }

  const caseNotes = await CaseNote.find(query).sort({ updatedAt: -1 });
  res.json(caseNotes);
};

export const getCaseNoteById = async (req, res) => {
  const caseNote = await CaseNote.findById(req.params.id);

  if (!caseNote) {
    throw createHttpError(404, "Case note not found.");
  }

  res.json(caseNote);
};

export const createCaseNote = async (req, res) => {
  const payload = buildCaseNotePayload(req.body);
  const errors = validateCaseNotePayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const caseNote = await CaseNote.create(payload);
  res.status(201).json(caseNote);
};

export const updateCaseNote = async (req, res) => {
  const payload = buildCaseNotePayload(req.body);
  const errors = validateCaseNotePayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const caseNote = await CaseNote.findById(req.params.id);

  if (!caseNote) {
    throw createHttpError(404, "Case note not found.");
  }

  caseNote.vehicle = payload.vehicle;
  caseNote.problem = payload.problem;
  caseNote.cause = payload.cause;
  caseNote.fix = payload.fix;
  caseNote.lessonLearned = payload.lessonLearned;
  await caseNote.save();

  res.json(caseNote);
};

export const deleteCaseNote = async (req, res) => {
  const caseNote = await CaseNote.findById(req.params.id);

  if (!caseNote) {
    throw createHttpError(404, "Case note not found.");
  }

  await caseNote.deleteOne();

  res.json({
    message: "Case note deleted.",
  });
};
