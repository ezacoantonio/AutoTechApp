import Category from "../models/Category.js";
import Topic from "../models/Topic.js";
import { createHttpError } from "../utils/http.js";
import { sanitizeText } from "../utils/text.js";

const buildCategoryPayload = (body) => ({
  name: sanitizeText(body.name),
  description: sanitizeText(body.description),
});

const validateCategoryPayload = (payload) => {
  const errors = [];

  if (!payload.name) {
    errors.push("Category name is required.");
  }

  return errors;
};

async function attachTopicCounts(categories) {
  return Promise.all(
    categories.map(async (category) => {
      const [activeTopicCount, deletedTopicCount] = await Promise.all([
        Topic.countDocuments({
          categoryId: category._id,
          isDeleted: false,
        }),
        Topic.countDocuments({
          categoryId: category._id,
          isDeleted: true,
        }),
      ]);

      return {
        ...category.toObject(),
        activeTopicCount,
        deletedTopicCount,
      };
    })
  );
}

export const listCategories = async (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true";
  const categories = await Category.find(
    includeDeleted ? {} : { isDeleted: false }
  ).sort({ name: 1 });

  res.json(await attachTopicCounts(categories));
};

export const createCategory = async (req, res) => {
  const payload = buildCategoryPayload(req.body);
  const errors = validateCategoryPayload(payload);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(" "));
  }

  const existingCategory = await Category.findOne({
    name: new RegExp(`^${payload.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
  });

  if (existingCategory) {
    throw createHttpError(
      409,
      existingCategory.isDeleted
        ? "This category already exists in recently deleted. Restore it instead."
        : "A category with this name already exists."
    );
  }

  const category = await Category.create(payload);
  res.status(201).json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!category) {
    throw createHttpError(404, "Category not found.");
  }

  const deletedAt = new Date();
  category.isDeleted = true;
  category.deletedAt = deletedAt;
  await category.save();

  const updateResult = await Topic.updateMany(
    {
      categoryId: category._id,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt,
        deletedReason: "category",
        deletedCategoryId: category._id,
      },
    }
  );

  res.json({
    message: "Category moved to recently deleted.",
    movedTopicCount: updateResult.modifiedCount,
  });
};

export const restoreCategory = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    isDeleted: true,
  });

  if (!category) {
    throw createHttpError(404, "Deleted category not found.");
  }

  category.isDeleted = false;
  category.deletedAt = null;
  await category.save();

  const restoreResult = await Topic.updateMany(
    {
      categoryId: category._id,
      isDeleted: true,
      deletedReason: "category",
      deletedCategoryId: category._id,
    },
    {
      $set: {
        category: category.name,
        isDeleted: false,
        deletedAt: null,
        deletedReason: null,
        deletedCategoryId: null,
      },
    }
  );

  res.json({
    message: "Category restored.",
    restoredTopicCount: restoreResult.modifiedCount,
  });
};

