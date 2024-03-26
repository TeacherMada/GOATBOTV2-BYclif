const { createReadStream, unlinkSync, createWriteStream } = require("fs-extra");
const { resolve } = require("path");
const axios = require("axios");
//const fs = require('fs');
//const path = require("path");
const vipData = fs.readFileSync(path.join(__dirname, "vip.json"), "utf8");
const vipJson = JSON.parse(vipData);

function isVip(permission) {
    return vipJson.permission.includes(permission.toString());
}


module.exports = {
  config: {
    name: "say",
    aliases: ["parle"],
    version: "1.1",
    author: "otineeeeyyyyyyyy",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "[👑] text to audio",
    },
    longDescription: {
      en: "text to speech language",
    },
    category: "fun",
    guide: {
      en: "/say [language] [text]: Convert text to speech. Default language is English.
Example usages:
/say hi
/say ja こんにちは"
    },
  },

  onStart: async function ({ api, event, args, getLang }) {
    try {
 if (!isVip(event.author)) {
            api.sendMessage("Sorry, you are not a VIP member. Please contact the admin(s) to access VIP commands.", event.threadID, event.messageID);
            return;
        }

        const senderID = event.senderID;

      
      const content = event.type === "message_reply" ? event.messageReply.body : args.join(" ");
      const supportedLanguages = ["fr", "en", "es", "ja", "tl", "vi", "in", "zh"];
      const defaultLanguage = "fr"; // Set the default language to "en"
      const languageToSay = supportedLanguages.some((item) => content.indexOf(item) === 0) ? content.slice(0, content.indexOf(" ")) : defaultLanguage;
      const msg = languageToSay !== defaultLanguage ? content.slice(3, content.length) : content;
      const path = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`;
      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
      });

      const writer = response.data.pipe(createWriteStream(path));
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.sendMessage(
        { attachment: createReadStream(path) },
        event.threadID,
        () => unlinkSync(path)
      );
    } catch (error) {
      console.error("Error occurred during TTS:", error);
      // Handle error response here, e.g., send an error message to the user
    }
  },
};
