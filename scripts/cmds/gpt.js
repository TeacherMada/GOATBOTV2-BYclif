const { get } = require('axios');

module.exports = {
	config: {
		name: "gpt",
		author: "deku",
		version: "2.0",
		cooldowns: 0,
		role: 0,
		shortDescription: {
			en: "[🆓️] #gpt Questions"
		},
		category: "AI",
		guide: {
			en: "#gpt question"
		}
	},

	onStart: async function ({ api, event, args }) {
		const prompt = args.join(' ');
		const id = event.senderID;

		function sendMessage(msg) {
			api.sendMessage(msg, event.threadID, event.messageID);
		}

		//const url = "http://eu4.diresnode.com:3301";

		if (!prompt) return sendMessage("Ex: #gpt Salut");
		sendMessage("🕞");

		try {
			const response = await get(`https://apis-samir.onrender.com/gpt?content=${encodeURIComponent(prompt)}`);
			sendMessage(response);
		} catch (error) {
			sendMessage(error.message);
		}
	},
};
