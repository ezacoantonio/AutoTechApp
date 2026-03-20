import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import { isInMemoryDbEnabled } from "../src/config/db.js";
import { seedDatabase } from "../src/data/seedDatabase.js";

const seed = async () => {
  try {
    if (isInMemoryDbEnabled()) {
      console.log(
        "USE_IN_MEMORY_DB is enabled. Start the dev server to get auto-seeded sample data for local testing."
      );
      return;
    }

    await connectDB();
    const result = await seedDatabase({ reset: true });

    console.log(
      `Seeded ${result.categories} categories, ${result.topics} topics, ${result.caseNotes} case notes, and ${result.notebooks} notebooks.`
    );
  } catch (error) {
    console.error("Seed failed.", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
