import Category from "../models/Category.js";
import Topic from "../models/Topic.js";

export const listRecentlyDeleted = async (req, res) => {
  const [categories, topics] = await Promise.all([
    Category.find({ isDeleted: true }).sort({ deletedAt: -1, updatedAt: -1 }),
    Topic.find({ isDeleted: true }).sort({ deletedAt: -1, updatedAt: -1 }),
  ]);

  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const movedTopicCount = await Topic.countDocuments({
        categoryId: category._id,
        isDeleted: true,
      });

      return {
        ...category.toObject(),
        movedTopicCount,
      };
    })
  );

  res.json({
    categories: categoriesWithCounts,
    topics,
  });
};

