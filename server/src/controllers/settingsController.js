const Settings = require("../models/Settings");

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { notifyEmail, blogTitle, blogSubtitle } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        notifyEmail,
        blogTitle,
        blogSubtitle,
      });
    } else {
      if (notifyEmail !== undefined) settings.notifyEmail = notifyEmail;
      if (blogTitle !== undefined) settings.blogTitle = blogTitle;
      if (blogSubtitle !== undefined) settings.blogSubtitle = blogSubtitle;
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

module.exports = { getSettings, updateSettings };
