import { Message } from "discord.js";

export default {
    async run({ message }: { message: Message }) {
        if (message.author.bot) return;
        const { content, channel } = message;
        let regex = /https:\/\/(www\.|)youtu(be\.com|\.be)\/[\S]*(\?|&)t=[\d]+(\n| |)/im;
        if (!regex.test(content)) return;
        channel.send("*Timed*");
    }
}