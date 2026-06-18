const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: [String],
      default: [],
    },
    aiFeedback:{
        type: String,gi
        default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);