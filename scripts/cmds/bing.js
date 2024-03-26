const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FAByBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACEMcQOL4Cx20MATxQ9w4RUoj9c6udjcGWkwBzSqwnMW5jlcWEPaUALxs8bwfDODOEYc7jx6F+LeUTP+W2oISHZjhzb+kd0s9Qptl6Lv+J3GpSTStfDq44oMklokGqSZzUIrObpJQiO7jvwVNRuzPCOE1TyCN7pbhdi/IHYod90ekKGd5673Xz79AwDWrYDWmZXv3JYsWN35dxtzBwCUSy3Luf5mw2Ia7n+JR30r+B4aswwylFr6nugAaa/qFEgLdNLflrPxcbM5i5OVPcNyZ5Ruhf1hqz/1ow6g/bKuvzrPXnmACgN2iQjRHygeT2RzRuYYzCL9LORXndB3AbRJk6Mi8olqJJJ8tUwIbiDaMqO1QQnSMnJTipRCsbXI/DmapEO9bbdc1CgpwcjiOzxUug47ga8vutZDwcLNK9tsAD651WiFDdIXg8Twjhc5kzB29WmYMBJAnS70tklmVuRpjSlC+ydNXk5F0vofjpQjxrQvx4mHK8LcIaOAT5Q61pPtS+4GAKywcRg0M0tdOWSc3AJgeucGGFolkBn9xDkAbhHP05V6VOwFmwxY81YOqrh560I6hy3NY33K5rMWxp4QsAhm3/UdCI0ycIUAl5F0PiXfcSj4IuI+kHoIl1+ZWqzOEjjCw1hEHqfCLHi2Cn0Cj2q9gPhMSrh9maBJsWiISXG6cBEnQ5Ki0fPVeK0cMQuAGh4Rfp/6+8vjsk0bMWxsQGRk6vOp8teOHmlsoMe43OxgNyk47ei10uOMRDUuAcswwaLC8BPWNmUrgseUcK6x6aLS4Jix3FhcYXR55HYSexh2+XAGwIQ48SEIg6mXIjzyX8eJ0VSEUAsMDTqPKU3MxEXcgFDE62vNHmiRfOhIKATpw6oH93g/O3rAzj4Jxgy9EKPgLcEd2xYqlZN6EyGTGPUfytiik4kL++eS4+pfXYl8zk9wVBlxgWqnp3BaVuZlBd6G0yJeUGknwlRubb7+elidOSCcs9Dvu7qFxtRseK+5o4pwBs2hnx/UHf1rMmWS09DpbIyC+ap7jbQWLNO56mTCmPeHBdIdO+6/hyvr2g5FCsztQ6UpdaA2AMdu2OT3hSjVRBIW0OkBg68bcHF6OtIPGSxkz1MeUQ02iYMYseQsa+TAYRt9sBRmecCVLdYnYPCfpZ4IJrSeJBBq3uZIlDXnsct+NvpYWC2/URubBKIYJstjFATv7OxrsctXz34JXL6UtHrzyTiZEuCQHO7W+pO0ZrF74uvS6P+vvSeiPnhN1+XpCPfXqnWWMoxnJvOq4DRXPxhJiTZNDZRsDhiW9Y/HN9NvGdqjVTFmNJz/Kq96R9X3dqC2qLKeqnNfxJFwmtHT9/5aftfEUyXuO3Oz6MYvezWnAzsdwKyBgo6xYigLttwR6y6lJjOX3AnGkqcIbpqdfO4Vvfu7PVVKwMMZYZhGZaBWeZZ7yA8iPFAA08Qqz3kH3CMZyQrppGcf0XoTNYg==";
const _U = "1-lFEmAhZ_cMUVWxQ_8p5x186Gwb7Q9XmRQoKa-_YT9SyuJ7YIhOGH9vVgP6NyFZ0sXTmvugV_WaDAmoj0ZSG8oTpVqe4YKQiRETkuOEgPlBrSW_TQlEIzVRu-jmKEq9YOBZ2E3tYjYdONDJrA2G8QeBzjrwH3ZeauRY33KBXUcFqAKOPlbnk8Sqmf7pooGW1YzkDJ8QV3wbmc6g6NIQZsMFySjHu79v54Bkymm68RfA";
module.exports = {
config: {
name: "bing",
aliases: ["bng"],
version: "1.0.2",
author: "Samir Œ ",
role: 0,
cooldowns: 85,
shortDescription: {
en: "[👑] Bing créer images"
},
longDescription: {
en: ""
},
category: "image Ai",
guide: {
en: "bing [prompt] - [number of images]"
}
},


onStart: async function ({ api, event, args }) {


const uid = event.senderID
const permission = [`${uid}`];
if (!permission.includes(event.senderID)) {
api.sendMessage(
"You don't have enough permission to use this command. Only admin can do it.",
event.threadID,
event.messageID
);
return;
}


const keySearch = args.join(" ");
const indexOfHyphen = keySearch.indexOf('-');
const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;


try {

api.sendMessage("🕞 | Attendez svp..", event.threadID, event.messageID);
const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
const data = res.data.results.images;


if (!data || data.length === 0) {
api.sendMessage("No images found.", event.threadID, event.messageID);
return;
}


const imgData = [];
for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
await fs.outputFile(imgPath, imgResponse.data);
imgData.push(fs.createReadStream(imgPath));
}


await api.sendMessage({
attachment: imgData,
body: `✅`
}, event.threadID, event.messageID);


} catch (error) {
console.error(error);
api.sendMessage("Oh no! je suis malade, je vais chez mon docteur et après on peut continuer!", event.threadID, event.messageID);
} finally {
await fs.remove(path.join(__dirname, 'cache'));
}
}
};
