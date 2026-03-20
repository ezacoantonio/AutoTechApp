import Category from "../models/Category.js";
import Topic from "../models/Topic.js";
import CaseNote from "../models/CaseNote.js";
import Notebook from "../models/Notebook.js";
import {
  seedCaseNotes,
  seedCategories,
  seedNotebooks,
  seedTopics,
} from "./seedData.js";

export async function seedDatabase({ reset = false } = {}) {
  if (reset) {
    await Category.deleteMany({});
    await Topic.deleteMany({});
    await CaseNote.deleteMany({});
    await Notebook.deleteMany({});
  }

  const [categoryCount, topicCount, caseNoteCount, notebookCount] =
    await Promise.all([
      Category.countDocuments(),
      Topic.countDocuments(),
      CaseNote.countDocuments(),
      Notebook.countDocuments(),
    ]);

  if (
    categoryCount === 0 &&
    topicCount === 0 &&
    caseNoteCount === 0 &&
    notebookCount === 0
  ) {
    const createdCategories = await Category.insertMany(seedCategories);
    const categoryIdByName = new Map(
      createdCategories.map((category) => [category.name, category._id])
    );

    await Topic.insertMany(
      seedTopics.map((topic) => ({
        ...topic,
        categoryId: categoryIdByName.get(topic.category),
      }))
    );
    await CaseNote.insertMany(seedCaseNotes);
    await Notebook.insertMany(seedNotebooks);

    return {
      seeded: true,
      categories: seedCategories.length,
      topics: seedTopics.length,
      caseNotes: seedCaseNotes.length,
      notebooks: seedNotebooks.length,
    };
  }

  return {
    seeded: false,
    categories: categoryCount,
    topics: topicCount,
    caseNotes: caseNoteCount,
    notebooks: notebookCount,
  };
}
