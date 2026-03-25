const About = require("../models/About");

/**
 * @route   GET /api/about
 * @desc    Get the single About document (bio + image)
 * @access  Public
 */
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.json({ bio: "", imageUrl: "" });
    }

    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch about information" });
  }
};

/**
 * @route   PUT /api/about
 * @desc    Create or update the About document (upsert)
 * @access  Admin
 */
const updateAbout = async (req, res) => {
  try {
    const { bio, imageUrl, resumeUrl, socialLinks, title, tagline, name } =
      req.body;

    if (!bio) {
      return res.status(400).json({ error: "Bio text is required" });
    }

    const about = await About.findOneAndUpdate(
      {},
      {
        bio,
        name: name || "",
        title: title || "",
        tagline: tagline || "",
        imageUrl: imageUrl || "",
        resumeUrl: resumeUrl || "",
        socialLinks: socialLinks || [],
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Failed to update about information" });
  }
};

module.exports = { getAbout, updateAbout };
