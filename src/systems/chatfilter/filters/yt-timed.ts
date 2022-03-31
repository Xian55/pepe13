import { Permissions, TextChannel, Message } from "discord.js";
import path from "path";
import { hasPermission } from "../../../utils/hasPermission";
import { logHandler } from "../../../utils/logHandler";

export default {
    async run({ message }: { message: Message }) {
        if (message.author.bot) return;
        const { guild, channel, content } = message;
        let regex = /https:\/\/(www\.|)youtu(be\.com|\.be)\/[\S]*(\?|&)t=[\d]+(\n| |)/im;
        if (!regex.test(content)) return;

        if (!hasPermission(guild.me, channel as TextChannel, [Permissions.FLAGS.SEND_MESSAGES])) {
            logHandler.log("error", `${path.basename(__filename)} Dont have permission in ${channel}`);
            return;
        }

        await message.reply("*Timed*");
    }
}