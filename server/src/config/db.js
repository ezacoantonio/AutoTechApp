import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "..", "..");
const mongoBinaryCacheDir = path.join(projectRoot, ".cache", "mongodb-binaries");

export const isProductionEnvironment = () =>
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

export const isInMemoryDbEnabled = () =>
  !isProductionEnvironment() && process.env.USE_IN_MEMORY_DB === "true";

export const stopInMemoryDatabase = async () => {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI;
  let isInMemory = false;

  if (isInMemoryDbEnabled()) {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "mechanic-mindset",
      },
      binary: {
        downloadDir: mongoBinaryCacheDir,
      },
    });
    mongoUri = memoryServer.getUri();
    isInMemory = true;
  }

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log(
    `MongoDB connected${isInMemory ? " using in-memory development mode" : ""}.`
  );

  return {
    isInMemory,
    mongoUri,
  };
};

export default connectDB;
