const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "postfb",
    aliases: ["autopost","publier"],
    version: "1.0",
    author: "jfhigtfdv",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Create a new post on Facebook."
    },
    longDescription: {
      en: "Create a new post on Facebook with text, images, and video."
    },
    category: "Social",
    guide: {
      en: "{pn}: post"
    }
  },

  onStart: async function ({ event, api, commandName }) {
    const { threadID, messageID, senderID } = event;
    const uuid = getGUID();
    const formData = {
      "input": {
        "composer_entry_point": "inline_composer",
        "composer_source_surface": "timeline",
        "idempotence_token": uuid + "_FEED",
        "source": "WWW",
        "attachments": [],
        "audience": {
          "privacy": {
            "allow": [],
            "base_state": "FRIENDS", // SELF EVERYONE
            "deny": [],
            "tag_expansion_state": "UNSPECIFIED"
          }
        },
        "message": {
          "ranges": [],
          "text": ""
        },
        "with_tags_ids": [],
        "inline_activities": [],
        "explicit_place_id": "0",
        "text_format_preset_id": "0",
        "logging": {
          "composer_session_id": uuid
        },
        "tracking": [
          null
        ],
        "actor_id": api.getCurrentUserID(),
