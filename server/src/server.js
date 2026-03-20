import "dotenv/config";
import app from "./app.js";
import connectDB, { stopInMemoryDatabase } from "./config/db.js";
import { seedDatabase } from "./data/seedDatabase.js";

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  const connection = await connectDB();
  const seedResult = await seedDatabase();

  if (seedResult.seeded) {
    console.log(
      `Loaded starter data: ${seedResult.categories} categories, ${seedResult.topics} topics, ${seedResult.caseNotes} case notes, and ${seedResult.notebooks} notebooks.`
    );
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
    if (connection.isInMemory) {
      console.log("In-memory MongoDB is enabled for local testing.");
    }
  });
};

startServer().catch((error) => {
  console.error("Failed to start the server.", error);
  process.exit(1);
});

const shutdown = async () => {
  await stopInMemoryDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
