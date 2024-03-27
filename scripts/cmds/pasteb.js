const fs = require('fs');
const path = require('path');
const axios = require('axios');


module.exports = {
  config: {
    name: "pasteb",
    aliases: ['pbin', 'shareb'],
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "[👨‍🔧] Admin dev"
    },
    longDescription: {
      en: "This command allows you to upload files and text to pastebin and send the link to the file."
    },
    category: "Utility",
    guide: {
      en: "To use this command, type !paste file <name> or paste text <text>."
    }
  },


  onStart: async function ({ api, event, args, content }) {
    const permission = ["61552825191002"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage(" Tsanta dev irery ihany no afaka mampiasa ity!", event.threadID, event.messageID);
    }
    if (!args[0]) {
      return api.sendMessage('Please learn how to use $paste text (words) or paste file (filename)', event.threadID);
    }


    if (args[0] === "text") {
      const text = args.slice(1).join(" ");
      const pasteData = {
        name: "Text Paste",
        content: text,
        key: "Samir00",
        burn: "false",
        lock: "false",
        encrypt: "false"
      };


      try {
        const response = await axios.post("https://paste--samirzyx.repl.co/upload", pasteData);
        const rawPaste = response.data.url.replace("pastebin.samir/oe.repl.co", "pastebin.samir/oe.repl.co/raw");
        api.sendMessage(`Text created ✅ 
🔗 Text Link: ${rawPaste}`, event.threadID);


      } catch (error) {
        console.error(error);
      }
    } else if (args[0] === "file") {
      const fileName = args[1];
      const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
      const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');


      if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
        return api.sendMessage('File not found!', event.threadID);
      }


      const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;


      fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) throw err;


        const pasteData = {
          name: fileName,
          content: data,
          key: "Samir00",
          burn: "false",
          lock: "false",
          encrypt: "false"
        };


        try {
          const response = await axios.post("https://paste--samirzyx.repl.co/upload", pasteData);
          const rawPaste = response.data.url.replace("pastebin.samir/oe.repl.co", "pastebin.samir/oe.repl.co/raw");
          api.sendMessage(`
File created ✅
file name: ${fileName}.js
🔗 Link: ${rawPaste}`, event.threadID);


        } catch (error) {
          console.error(error);
        }
      });
    } else {
      api.sendMessage('Please learn how to use $paste text (words) or paste file (filename)', event.threadID);
    }
  },
};
