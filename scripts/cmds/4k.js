const a = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "4k",
    version: "1.0",
    author: "MR.AYAN",
    countDown: 15,
    role: 0,
    longDescription: "Upscale your image.",
    category: "image",
    guide: {
      en: "{pn} reply to an image"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    let imageUrl;

    if (event.type === "message_reply") {
      const replyAttachment = event.messageReply.attachments[0];

      if (["photo", "sticker"].includes(replyAttachment?.type)) {
        imageUrl = replyAttachment.url;
      } else {
        return api.sendMessage(
          { body: "⚠️ | Reply must be an image." },
          event.threadID
        );
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else {
      return api.sendMessage({ body: "❌ | Reply to an image." }, event.threadID);
    }

    try {
      const url = await tinyurl.shorten(imageUrl);
      const k = await a.get(`https://www.api.vyturex.com/upscale?imageUrl=${url}`);

      message.reply("☢️ | ᴡᴀɪᴛ ʙᴀʙʏ ᴅᴏᴡɴʟᴏᴀᴅ ɴᴏᴡ•••");

      const resultUrl = k.data.resultUrl;

      message.reply({ body: "✨ | Done\n\na Here is your photo ", attachment: await global.utils.getStreamFromURL(resultUrl) });
    } catch (error) {
      message.reply("❌ | Error: " + error.message);
    }
  }
}; 
