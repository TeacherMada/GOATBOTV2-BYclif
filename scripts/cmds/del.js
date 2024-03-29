module.exports = {
  config: {
    name: "del",
    aliases: ["delete"],
    author: "S",
role: 2,
shortDescription: {
  en:"[👨‍🔧] Admin dev"
},

    category: "Admin"
  },


  onStart: async function ({ api, event, args }) {
   const permission = ["61552825191002"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("⚠️ | Seul nos développeurs peuvent utiliser ce commande", event.threadID, event.messageID);
 const fs = require('fs');
    const path = require('path');


    const fileName = args[0];


    if (!fileName) {
      api.sendMessage("Please provide a filname to del.", event.threadID);
      return;
    }


    const filePath = path.join(__dirname, fileName);


    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        api.sendMessage(`❎ | Failed to delete ${fileName}.`, event.threadID);
        return;
      }
      api.sendMessage(`✅ ( ${fileName} ) Deleted successfully!`, event.threadID);
    });
  }
};
