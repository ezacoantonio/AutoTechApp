import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    whatItIs: {
      type: String,
      required: true,
      trim: true,
    },
    commonFailures: {
      type: String,
      required: true,
      trim: true,
    },
    symptoms: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    recommendedFix: {
      type: String,
      required: true,
      trim: true,
    },
    roadmapStepIds: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedReason: {
      type: String,
      enum: ["manual", "category", null],
      default: null,
    },
    deletedCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

topicSchema.index({
  title: "text",
  category: "text",
  whatItIs: "text",
  commonFailures: "text",
  symptoms: "text",
  diagnosis: "text",
  recommendedFix: "text",
});

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
