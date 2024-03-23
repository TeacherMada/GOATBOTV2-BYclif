const fs = require("fs");
const path = require("path");
const axios = require("axios");
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "draw",
    aliases: [],
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 40,
    role: 0,
    shortDescription: "lado",
    longDescription: "image to image",
    category: "fun",
    guide: "{p}draw reply to image",
  },
  onStart: async function ({ message, event, args, api }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const promptApiUrl = "https://www.api.vyturex.com/describe?url="; // api from jarif
      const sdxlApiUrl = "https://www.api.vyturex.com/sdxl";

      if (event.type !== "message_reply") {
        return message.reply("❌ | Répondre une photo, puis écrit: #draw");
      }

      const attachment = event.messageReply.attachments[0];
      if (!attachment || !["photo", "sticker"].includes(attachment.type)) {
        return message.reply("❌ | Répondre une photo svp!!");
      }

     
      const imageUrl = await tinyurl.shorten(attachment.url);

     
      const promptResponse = await axios.get(promptApiUrl + encodeURIComponent(imageUrl));
      let promptFromImage = promptResponse.data;

   
      const additionalPrompt = "a character 3D HD, realistic, anyme"; 

      
      const combinedPrompt = additionalPrompt + " " + promptFromImage;

     
      let model = 5;

    
      if (args.length > 0) {
        const specifiedModel = parseInt(args[0]);
        if (!isNaN(specifiedModel)) {
          model = specifiedModel;
        }
      }

    
      const sdxlResponse = await axios.get(`${sdxlApiUrl}?prompt=${encodeURIComponent(combinedPrompt)}&model=${model}`, {
        responseType: "stream"
      });

    
      const cacheFolderPath = path.join(__dirname, "/cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      const fileStream = fs.createWriteStream(imagePath);

      
      sdxlResponse.data.pipe(fileStream);

      
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

   
      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "",
        attachment: stream
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};
