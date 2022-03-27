import { GuildEmoji, Message } from "discord.js";
import { client } from "../../..";

const memeTypes = ["image/jpeg", "image/png", "video/mp4", "image/gif", "gifv"];
var memeCoin: GuildEmoji;

client.on("ready", () => {
    memeCoin = client.emojis.cache.find(emoji => emoji.name === "memecoin");
});

export default {
    async run({ message }) {
        if (shouldReact(message))
            message.react(memeCoin.id);
    }
}

function shouldReact(message: Message) {
    const { attachments } = message;
    return attachments.size > 0 && memeTypes.includes(attachments.at(0).contentType);
}