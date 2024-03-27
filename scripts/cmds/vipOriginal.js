const fs = require('fs').promises;
const path = require('path');
const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
    config: {
        name: "vip",
        version: "1.0",
        author: "Kshitiz",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "",
            en: "[👨‍💻] Gestion membre VIP"
        },
        longDescription: {
            vi: "Gửi tin nhắn đến thành viên VIP",
            en: "handle vip members"
        },
        category: "admin",
        guide: {
            vi: "",
            en: "{p} vip <message> to sent msg to vip user\n{p} vip add {uid} \n {p} vip remove {uid} \n {p} vip list"
        }
    },

    langs: {
        vi: {
            
        },
        en: {
            missingMessage: "📄 TUTO : \n ▪︎Ajouter un membre: \n#vip add ID\n\n ▪︎Supprimé un membre:\n #vip remove ID\n\n ▪︎Liste membre VIP:\n #vip list \n\n ▪︎Envoyer un message au membre vip:\n #vip Salut tous les membre!",
            sendByGroup: "\n- Sent from group: %1\n- Thread ID: %2",
            sendByUser: "\n- envoyé par un utilisateur",
            content: "\n\n📄 MESSAGE: \n %1\n\n ____________\n Répondez cette message pour répondre cette message",
            success: "Votre message a été envoyé au membres VIP avec succès!\n\n %2",
            failed: "An error occurred while sending your message to VIP\n%2\nCheck console for more details",
            reply: "↪ Réponse de VIP \n %1:\n\n %2",
            replySuccess: "Votre réponse a été  envoyé au membre VIP avec succès!",
            feedback: "📝 Message d'un membre VIP \n %1:\nID: %2\n%3\n\n📩Message: %4",
            replyUserSuccess: "Votre message a été envoyé au membre VIP avec succès!",
            noAdmin: "Désolé Vous n'avez pas la permission!",
            addSuccess: "📥 Nouveau membre a été ajouté au Liste VIP avec succès!",
            alreadyInVIP: "Member is already in the VIP list!",
            removeSuccess: "📤 Ce membre a été supprimé au liste VIP avec succès!",
            notInVIP: "Ce membre n'est pas encore au liste VIP.",
            list: "👑 LISTE MEMBRE VIP:\n\n%1",
        }
    },

     onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
            const { config } = global.GoatBot;
            const vipDataPath = path.join(__dirname, 'vip.json'); 
            const { senderID, threadID, isGroup } = event;

           
            if (args[0] !== 'add' && args[0] !== 'remove') {
                const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
                if (!vipData.permission || !vipData.permission.includes(senderID)) {
                    return message.reply(getLang("missingMessage"));
                }
            }

           
            if (args[0] === 'add' || args[0] === 'remove') {
                if (!config.adminBot.includes(senderID)) {
                    return message.reply(getLang("noAdmin"));
                }
            }

            if (!args[0]) {
                return message.reply(getLang("missingMessage"));
            }

            const senderName = await usersData.getName(senderID);
            const msg = "👑📨️ VIP MESSAGE 📨️👑"
                + `\n↪${senderName}`

            const formMessage = {
                body: msg + getLang("content", args.join(" ")),
                mentions: [{
                    id: senderID,
                    tag: senderName
                }],
                attachment: await getStreamsFromAttachment(
                    [...event.attachments, ...(event.messageReply?.attachments || [])]
                        .filter(item => mediaTypes.includes(item.type))
                )
            };

            if (args[0] === 'add' && args.length === 2) {
                const userId = args[1];
                const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
                if (!vipData.permission) {
                    vipData.permission = [];
                }
                if (!vipData.permission.includes(userId)) {
                    vipData.permission.push(userId);
                    await fs.writeFile(vipDataPath, JSON.stringify(vipData, null, 2));
                    return message.reply(getLang("addSuccess"));
                } else {
                    return message.reply(getLang("alreadyInVIP"));
                }
            }

            else if (args[0] === 'remove' && args.length === 2) {
                const userId = args[1];
                const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
                if (!vipData.permission) {
                    vipData.permission = [];
                }
                if (vipData.permission.includes(userId)) {
                    vipData.permission = vipData.permission.filter(id => id !== userId);
                    await fs.writeFile(vipDataPath, JSON.stringify(vipData, null, 2));
                    return message.reply(getLang("removeSuccess"));
                } else {
                    return message.reply(getLang("notInVIP"));
                }
            }

            else if (args[0] === 'list') {
                const vipData = await fs.readFile(vipDataPath).then(data => JSON.parse(data)).catch(() => ({}));
                const vipList = vipData.permission ? await Promise.all(vipData.permission.map(async id => {
                    const name = await usersData.getName(id);
                    return `▪︎${name}_${id}`;
                })) : '';
                return message.reply(getLang("list", vipList.join('\n') || ''));
            }

            else {
                const successIDs = [];
                const failedIDs = [];
                const vipAdmins = await fs.readFile(vipDataPath)
                    .then(data => JSON.parse(data).permission)
                    .catch(err => {
                        console.error(err);
                        return [];
                    });

                const adminNames = await Promise.all(vipAdmins.map(async item => ({
                    id: item,
                    name: await usersData.getName(item)
                })));

                for (const uid of vipAdmins) {
                    try {
                        const messageSend = await api.sendMessage(formMessage, uid);
                        successIDs.push(uid);
                        global.GoatBot.onReply.set(messageSend.messageID, {
                            commandName,
                            messageID: messageSend.messageID,
                            threadID,
                            messageIDSender: event.messageID,
                            type: "userCallAdmin"
                        });
                    }
                    catch (err) {
                        failedIDs.push({
                            adminID: uid,
                            error: err
                        });
                    }
                }

                let msg2 = "";
                if (successIDs.length > 0) {
                    msg2 += getLang("success", successIDs.length,
                        adminNames.filter(item => successIDs.includes(item.id)).map(item => ` <@${item.id}> (${item.name})`).join("\n")
                    );
                }
                if (failedIDs.length > 0) {
                    msg2 += getLang("failed", failedIDs.length,
                        failedIDs.map(item => ` [@${item.adminID}] (${adminNames.find(item2 => item2.id == item.adminID)?.name || item.adminID})`).join("\n")
                    );
                    log.err("VIP MESSAGE", failedIDs);
                }
                return message.reply({
                    body: msg2,
                    mentions: adminNames.map(item => ({
                        id: item.id,
                        tag: item.name
                    }))
                });
            }
        },

        onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
            const { type, threadID, messageIDSender } = Reply;
            const senderName = await usersData.getName(event.senderID);
            const { isGroup } = event;

            switch (type) {
                case "userCallAdmin": {
                    const formMessage = {
                        body: getLang("reply", senderName, args.join(" ")),
                        mentions: [{
                            id: event.senderID,
                            tag: senderName
                        }],
                        attachment: await getStreamsFromAttachment(
                            event.attachments.filter(item => mediaTypes.includes(item.type))
                        )
                    };

                    api.sendMessage(formMessage, threadID, (err, info) => {
                        if (err)
                            return message.err(err);
                        message.reply(getLang("replyUserSuccess"));
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName,
                            messageID: info.messageID,
                            messageIDSender: event.messageID,
                            threadID: event.threadID,
                            type: "adminReply"
                        });
                    }, messageIDSender);
                    break;
                }
                case "adminReply": {
                    let sendByGroup = "";
                    if (isGroup) {
                        const { threadName } = await api.getThreadInfo(event.threadID);
                        sendByGroup = getLang("sendByGroup", threadName, event.threadID);
                    }
                    const formMessage = {
                        body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
                        mentions: [{
                            id: event.senderID,
                            tag: senderName
                        }],
                        attachment: await getStreamsFromAttachment(
                            event.attachments.filter(item => mediaTypes.includes(item.type))
                        )
                    };

                    api.sendMessage(formMessage, threadID, (err, info) => {
                        if (err)
                            return message.err(err);
                        message.reply(getLang("replySuccess"));
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName,
                            messageID: info.messageID,
                            messageIDSender: event.messageID,
                            threadID: event.threadID,
                            type: "userCallAdmin"
                        });
                    }, messageIDSender);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    };
