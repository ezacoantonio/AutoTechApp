import mongoose from "mongoose";

const chapterImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      default: "",
    },
    publicId: {
      type: String,
      trim: true,
      default: "",
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    format: {
      type: String,
      trim: true,
      default: "",
    },
    originalFilename: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: chapterImageSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: false,
  }
);

const notebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    roadmapStepIds: {
      type: [String],
      default: [],
    },
    chapters: {
      type: [chapterSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

notebookSchema.index({
  title: "text",
  summary: "text",
  "chapters.title": "text",
  "chapters.content": "text",
});

const Notebook = mongoose.model("Notebook", notebookSchema);

export default Notebook;
