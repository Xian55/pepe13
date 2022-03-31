import { Permissions, GuildEmoji, Message, TextChannel } from "discord.js";
import path from "path";
import { client } from "../../..";
import { hasPermission } from "../../../utils/hasPermission";
import { logHandler } from "../../../utils/logHandler";

const memeTypes = [
    "image/jpeg",
    "image/apng",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/ogg"
];

var memeCoin: GuildEmoji;

client.on("ready", () => {
    memeCoin = client.emojis.cache.find(emoji => emoji.name === "memecoin");
});

export default {
    async run({ message }: { message: Message }) {
        if (shouldReact(message)) {
            const { guild, channel } = message;
            if (!hasPermission(guild.me, channel as TextChannel, [Permissions.FLAGS.ADD_REACTIONS])) {
                logHandler.log("error", `${path.basename(__filename)} Dont have permission in ${channel}`);
                return;
            }

            message.react(memeCoin.id);
        }
    }
}

function shouldReact(message: Message) {
    const { attachments } = message;
    return attachments.size > 0 && memeTypes.includes(attachments.at(0).contentType);
}