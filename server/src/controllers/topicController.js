import Category from "../models/Category.js";
import Topic from "../models/Topic.js";
import { createHttpError } from "../utils/http.js";
import { escapeRegex, sanitizeText } from "../utils/text.js";

const buildTopicPayload = (body) => ({
  title: sanitizeText(body.title),
  categoryId: sanitizeText(body.categoryId),
  whatItIs: sanitizeText(body.whatItIs),
  commonFailures: sanitizeText(body.commonFailures),
  symptoms: sanitizeText(body.symptoms),
  diagnosis: sanitizeText(body.diagnosis),
  recommendedFix: sanitizeText(body.recommendedFix),
});

const validateTopicPayload = (payload) => {
  const errors = [];

  if (!payload.title) errors.push("Title is required.");
  if (!payload.categoryId) errors.push("Category is required.");
  if (!payload.whatItIs) errors.push("What it is is required.");
  if (!payload.commonFailures) errors.push("Common failures is required.");
  if (!payload.symptoms) errors.push("Symptoms is required.");
  if (!payload.diagnosis) errors.push("How to diagnose it is required.");
  if (!payload.recommendedFix) errors.push("Recommended fix is required.");

  return errors;
};

export const listTopics = async (req, res) => {
  const search = sanitizeText(req.query.search);
  const categoryId = sanitizeText(req.query.categoryId);
  const query = {
    isDeleted: false,
  };

  if (categoryId) {
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });

    if (!category) {
      throw createHttpError(400, "Category filter is invalid.");
    }

    query.categoryId = categoryId;
  }

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { title: pattern },
      { category: pattern },
      { whatItIs: pattern },
      { commonFailures: pattern },
      { symptoms: pattern },
      { diagnosis: pattern },
      { recommendedFix: pattern },
    ];
  }

  const topics = await Topic.find(query).sort({ updatedAt: -1, title: 1 });
  res.json(topics);
};

export const getTopicById = async (req, res) => {
  const topic = await Topic.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!topic) {
    throw createHttpError(404, "Topic not found.");
  }

  res.json(topic);
};

export const createTopic = async (req, res) => {
  const payload = buildTopicPayload(req.body);
  const errors = validateTopicPayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const category = await Category.findOne({
    _id: payload.categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw createHttpError(400, "Category is invalid.");
  }

  const topic = await Topic.create({
    ...payload,
    category: category.name,
    categoryId: category._id,
  });

  res.status(201).json(topic);
};

export const updateTopic = async (req, res) => {
  const payload = buildTopicPayload(req.body);
  const errors = validateTopicPayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const topic = await Topic.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!topic) {
    throw createHttpError(404, "Topic not found.");
  }

  const category = await Category.findOne({
    _id: payload.categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw createHttpError(400, "Category is invalid.");
  }

  topic.title = payload.title;
  topic.categoryId = category._id;
  topic.category = category.name;
  topic.whatItIs = payload.whatItIs;
  topic.commonFailures = payload.commonFailures;
  topic.symptoms = payload.symptoms;
  topic.diagnosis = payload.diagnosis;
  topic.recommendedFix = payload.recommendedFix;
  await topic.save();

  res.json(topic);
};

export const deleteTopic = async (req, res) => {
  const topic = await Topic.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!topic) {
    throw createHttpError(404, "Topic not found.");
  }

  topic.isDeleted = true;
  topic.deletedAt = new Date();
  topic.deletedReason = "manual";
  topic.deletedCategoryId = null;
  await topic.save();

  res.json({
    message: "Topic moved to recently deleted.",
  });
};

export const restoreTopic = async (req, res) => {
  const topic = await Topic.findOne({
    _id: req.params.id,
    isDeleted: true,
  });

  if (!topic) {
    throw createHttpError(404, "Deleted topic not found.");
  }

  const category = await Category.findOne({
    _id: topic.categoryId,
    isDeleted: false,
  });

  if (!category) {
    throw createHttpError(
      400,
      "Restore the related category first before restoring this topic."
    );
  }

  topic.category = category.name;
  topic.isDeleted = false;
  topic.deletedAt = null;
  topic.deletedReason = null;
  topic.deletedCategoryId = null;
  await topic.save();

  res.json({
    message: "Topic restored.",
    topic,
  });
};
