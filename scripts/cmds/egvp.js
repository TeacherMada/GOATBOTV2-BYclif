// add this in new code ↓
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const vipData = fs.readFileSync(path.join(__dirname, "vip.json"), "utf8");
const vipJson = JSON.parse(vipData);
function isVip(senderID) {
  return vipJson.permission.includes(senderID.toString());
}
// add this in new code ↑                                              



module.exports = {
  config: {
    name: "example",
    aliases: [],
    author: "Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "anime",
    guide: "{p}",
  },


  // copy this ↓ onStrat code upto }
  onStart: async function ({ api, event, args, message }) {
    
    if (!isVip(event.senderID)) {
      api.sendMessage("You are not a VIP member.", event.threadID, event.messageID);
      return;
    }
    
// normal code ↓
    try {
      const response = await axios.get(``, { responseType: "stream" });
      const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);

      const writer = fs.createWriteStream(tempVideoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);

        message.reply({
          body: ``,
          attachment: stream,
        });

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      });
    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};
