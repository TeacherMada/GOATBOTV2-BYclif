const axios = require('axios');

module.exports = {
	config: {
		name: "ai", //gpt4
		author: "cliff",
		version: "1.5",
		countDown: 5,
		role: 0,
		category: "GPT4",
		shortDescription: {
			en: "[🆓️] #Ai question"
		}
	},

	onStart: async function ({ api, event, args }) {
		try {
			const { messageID, messageReply } = event;
			let prompt = args.join(' ');

			if (messageReply) {
				const repliedMessage = messageReply.body;
				prompt = `${repliedMessage} ${prompt}`;
			}

			if (!prompt) {
				return api.sendMessage('Ex: #Ai Salut, Comment vas-tu?', event.threadID, messageID);
			}

			const gpt4_api = `https://apis-samir.onrender.com/gpt?content=${encodeURIComponent(prompt)}`;

			const response = await axios.get(gpt4_api);

			if (response.data && response.data.reply) {
				const generatedText = response.data.reply;
				api.sendMessage({ body: generatedText, attachment: null }, event.threadID, messageID);
			} else {
				console.error('API response did not contain expected data:', response.data);
				api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Response data: ${JSON.stringify(response.data)}`, event.threadID, messageID);
			}
		} catch (error) {
			console.error('Error:', error);
			api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`, event.threadID, event.messageID);
		}
	}
};
