const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
}, { _id: false });

const aboutSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: 'Devesh Pandey'
        },
        title: {
            type: String,
            trim: true,
            default: 'Full Stack Developer'
        },
        bio: {
            type: String,
            required: [true, 'Bio text is required'],
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },
        resumeUrl: {
            type: String,
            trim: true,
            default: '',
        },
        socialLinks: {
            type: [socialLinkSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const aboutSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      required: [true, "Bio text is required"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("About", aboutSchema);
