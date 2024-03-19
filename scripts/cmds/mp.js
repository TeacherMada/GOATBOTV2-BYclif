module.exports = {
  config: {
    name: "mp",
    aliases: ["pm"],
    version: "1.0",
    author: "luffy",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send anonymous message to user"
    },
    longDescription: {
      en: "Send anonymous message using thread or user ID"
    },
    category: "box chat",
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
        `✅ Message envoyé \n▪︎${message}\n ▪︎${idBox} `,
        event.threadID
      );
    });
  }
};
