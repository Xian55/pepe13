import { Permissions, TextChannel, Message } from "discord.js";
import path from "path";
import { hasPermission } from "../../../utils/hasPermission";
import { logHandler } from "../../../utils/logHandler";

const imgUrl = "https://pics.me.me/dont-xd-350-penalty-30971828.png";

const table = [
    "xd",
];

export default {
    async run({ message }: { message: Message }) {
        if (message.author.bot) return;

        const { guild, channel, content } = message;
        const words = content.toLowerCase().split(" ");
        let shouldDelete = false;
        words.forEach((word) => {
            if (table.includes(word)) {
                shouldDelete = true;
                return;
            }
        });

        if (!shouldDelete) return;

        if (!hasPermission(guild.me, channel as TextChannel, [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_MESSAGES])) {
            logHandler.log("error", `${path.basename(__filename)} Dont have permission in ${channel}`);
            return;
        }

        const reply = await message.reply(imgUrl);
        await message.delete();
        setTimeout(() => reply.delete(), 5000);
    }
}