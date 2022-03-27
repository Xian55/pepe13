export default {
    async run({ message }) {
        if (message.author.bot) return;
        const { content } = message;
        let regex = /https:\/\/(www\.|)youtu(be\.com|\.be)\/[\S]*(\?|&)t=[\d]+(\n| |)/im;
        if (!regex.test(content)) return;
        message.channel.send("*Timed*");
    }
}