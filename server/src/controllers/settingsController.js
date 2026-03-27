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
    const { notifyEmail, blogTitle, blogSubtitle, footerText, copyrightText } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        notifyEmail,
        blogTitle,
        blogSubtitle,
        footerText,
        copyrightText,
      });
    } else {
      if (notifyEmail !== undefined) settings.notifyEmail = notifyEmail;
      if (blogTitle !== undefined) settings.blogTitle = blogTitle;
      if (blogSubtitle !== undefined) settings.blogSubtitle = blogSubtitle;
      if (footerText !== undefined) settings.footerText = footerText;
      if (copyrightText !== undefined) settings.copyrightText = copyrightText;
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

module.exports = { getSettings, updateSettings };
