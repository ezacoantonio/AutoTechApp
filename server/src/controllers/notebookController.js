import Notebook from "../models/Notebook.js";
import { createHttpError } from "../utils/http.js";
import { escapeRegex, sanitizeText } from "../utils/text.js";

const sanitizeImagePayload = (image = {}) => ({
  url: sanitizeText(image.url),
  publicId: sanitizeText(image.publicId),
  width: Number.isFinite(Number(image.width)) ? Number(image.width) : null,
  height: Number.isFinite(Number(image.height)) ? Number(image.height) : null,
  format: sanitizeText(image.format),
  originalFilename: sanitizeText(image.originalFilename),
});

const sanitizeChapters = (chapters = []) =>
  Array.isArray(chapters)
    ? chapters.map((chapter) => ({
        title: sanitizeText(chapter.title),
        content: sanitizeText(chapter.content),
        image: sanitizeImagePayload(chapter.image),
      }))
    : [];

const buildNotebookPayload = (body) => ({
  title: sanitizeText(body.title),
  summary: sanitizeText(body.summary),
  chapters: sanitizeChapters(body.chapters),
});

const validateNotebookPayload = (payload) => {
  const errors = [];

  if (!payload.title) {
    errors.push("Notebook title is required.");
  }

  payload.chapters.forEach((chapter, index) => {
    if (!chapter.title) {
      errors.push(`Chapter ${index + 1} title is required.`);
    }

    if (!chapter.content) {
      errors.push(`Chapter ${index + 1} content is required.`);
    }
  });

  return errors;
};

export const listNotebooks = async (req, res) => {
  const search = sanitizeText(req.query.search);
  const query = {};

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { title: pattern },
      { summary: pattern },
      { "chapters.title": pattern },
      { "chapters.content": pattern },
    ];
  }

  const notebooks = await Notebook.find(query).sort({ updatedAt: -1, title: 1 });
  res.json(notebooks);
};

export const getNotebookById = async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);

  if (!notebook) {
    throw createHttpError(404, "Notebook not found.");
  }

  res.json(notebook);
};

export const createNotebook = async (req, res) => {
  const payload = buildNotebookPayload(req.body);
  const errors = validateNotebookPayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const notebook = await Notebook.create(payload);
  res.status(201).json(notebook);
};

export const updateNotebook = async (req, res) => {
  const payload = buildNotebookPayload(req.body);
  const errors = validateNotebookPayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const notebook = await Notebook.findById(req.params.id);

  if (!notebook) {
    throw createHttpError(404, "Notebook not found.");
  }

  notebook.title = payload.title;
  notebook.summary = payload.summary;
  notebook.chapters = payload.chapters;
  await notebook.save();

  res.json(notebook);
};

export const deleteNotebook = async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);

  if (!notebook) {
    throw createHttpError(404, "Notebook not found.");
  }

  await notebook.deleteOne();

  res.json({
    message: "Notebook deleted.",
  });
};
