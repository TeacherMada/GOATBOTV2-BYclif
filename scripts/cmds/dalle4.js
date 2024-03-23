const fs = require("fs");
const path = require("path");
const axios = require("axios");
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "dalle4",
    aliases: ["dall4"],
    version: "1.0",
    author: "vex_Kshitiz",
    countDown: 20,
    role: 0,
    shortDescription: "lado puti",
    longDescription: "image to image",
    category: "game",
    guide: {
      en: "{p}dalle4 reply to image or {p}dalle4 [prompt]"
    }
  },
  onStart: async function ({ message, event, args, api }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const promptApiUrl = "https://www.api.vyturex.com/describe?url="; 
      const sdxlApiUrl = "https://sdxl-kshitiz.onrender.com/gen";

      let imageUrl = null;
      let prompt = '';
      let style = 3;
      if (event.type === "message_reply") {
        const attachment = event.messageReply.attachments[0];
        if (!attachment || !["photo", "sticker"].includes(attachment.type)) {
          return message.reply("❌ | Répondre une photo svp.");
        }
        imageUrl = attachment.url;
        const promptResponse = await axios.get(promptApiUrl + encodeURIComponent(imageUrl));
        prompt = promptResponse.data;
      } else if (args.length > 0 && args[0].startsWith("http")) {
        imageUrl = args[0];
        const promptResponse = await axios.get(promptApiUrl + encodeURIComponent(imageUrl));
        prompt = promptResponse.data;
      } else if (args.length > 0) {
     
        const argParts = args.join(" ").split("|");
        prompt = argParts[0].trim();
        if (argParts.length > 1) {
          style = parseInt(argParts[1].trim());
        }
      } else {
        return message.reply("❌");
      }

      const sdxlResponse = await axios.get(sdxlApiUrl, {
        params: {
          prompt: prompt,
          style: style 
        }
      });

      if (sdxlResponse.data.status === "success") {
        const imageUrl = sdxlResponse.data.url;
        const imagePath = path.join(__dirname, "cache", `${Date.now()}_generated_image.png`);
        const imageResponse = await axios.get(imageUrl, { responseType: "stream" });
        const imageStream = imageResponse.data.pipe(fs.createWriteStream(imagePath));
        imageStream.on("finish", () => {
          const stream = fs.createReadStream(imagePath);
          message.reply({
            body: "",
            attachment: stream
          });
        });
      } else {
        throw new Error("Image generation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};
