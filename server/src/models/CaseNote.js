import mongoose from "mongoose";

const caseNoteSchema = new mongoose.Schema(
  {
    vehicle: {
      type: String,
      required: true,
      trim: true,
    },
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    cause: {
      type: String,
      required: true,
      trim: true,
    },
    fix: {
      type: String,
      required: true,
      trim: true,
    },
    lessonLearned: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

caseNoteSchema.index({
  vehicle: "text",
  problem: "text",
  cause: "text",
  fix: "text",
  lessonLearned: "text",
});

const CaseNote = mongoose.model("CaseNote", caseNoteSchema);

export default CaseNote;

