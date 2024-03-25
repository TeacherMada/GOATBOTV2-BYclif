const axios = require('axios');
const fs = require('fs');
const path = require("path");
const vipData = fs.readFileSync(path.join(__dirname, "vip.json"), "utf8");
const vipJson = JSON.parse(vipData);

function isVip(permission) {
    return vipJson.permission.includes(permission.toString());
}

module.exports = {
	config: {
		name: "thony", //gpt4
		author: "cliff",
		version: "1.5",
		countDown: 5,
		role: 0,
		category: "Ai",
		shortDescription: {
			en: "[👑] #thony question"
		}
	},

	onStart: async function ({ api, event, args }) {
		try {
      if (!vipJson.permission.includes(senderID.toString())) {
    api.sendMessage("Vous n'avez pas le droit d'utiliser cette commande. \n\n👑 ABONNEMENT VIP 5000Ar\n 038.22.222.02 \n\nVeuillez Contacter mon Admin: 👇 \nhttps://www.facebook.com/profile.php?id=100088104908849", threadID, messageID);
    return;
}
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
