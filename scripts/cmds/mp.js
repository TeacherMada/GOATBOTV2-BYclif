module.exports = {
  config: {
    name: "mp",
    aliases: ["pm"],
    version: "1.0",
    author: "TsantaBot",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "[👨‍💻] cmd add user @Admin1"
    },
    longDescription: {
      en: "Envoyer message / Ajouter un utilisateur by ID"
    },
    category: "Admin",
    guide:{
      en: "{p}pm id text"
    }
  },
  onStart: async function ({ api, event, args }) {
    if (args.length < 2) {
      return api.sendMessage(
        "▪︎Code: #mp [id] [messages] \n ▪︎Ex: #mp 01234567890120 Salut, Afaka mampiasa Chatbot @zay ianao!",
        event.threadID,
        event.messageID
      );
    }

    const idBox = args[0];
    const message = args.slice(1).join(" ");

    api.sendMessage({
      body: message,
      mentions: [{
        tag: "@pm",
        id: event.senderID
      }]
    }, idBox, () => {
      api.sendMessage(
        `✅ Message envoyé à 《${idBox}》\n\n📄: ${message}`,
        event.threadID
      );
    });
  }
};
