export default {
    async run({ message }) {
        const { content } = message;
        let regex = /https:\/\/(www\.|)youtu(be\.com|\.be)\/[\S]*(\?|&)t=[\d]+(\n| |)/im;
        if (regex.test(content)) {
            message.channel.send("*Timed*");
        }
    }
}