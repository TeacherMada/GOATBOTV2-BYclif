#cmd install del.js module.exports = {
  config: {
    name: "del",
    aliases: ["delete"],
    author: "S",
role: 2,
shortDescription: {
  en:"[👨‍🔧] Admin cmd"
},

    category: "Admin"
  },


  onStart: async function ({ api, event, args }) {
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
