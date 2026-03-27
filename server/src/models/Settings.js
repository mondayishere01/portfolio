const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    notifyEmail: {
      type: String,
      trim: true,
      default: "",
    },
    blogTitle: {
      type: String,
      trim: true,
      default: "Writings & Thoughts",
    },
    blogSubtitle: {
      type: String,
      trim: true,
      default:
        "Insights on software engineering, web development, and my technical journey.",
    },
    footerText: {
      type: String,
      trim: true,
      default: "Designed in Figma and coded in VS Code. Built with React and Tailwind CSS.",
    },
    copyrightText: {
      type: String,
      trim: true,
      default: "Devesh. All rights reserved.",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Settings", settingsSchema);
