const imgUrl = "https://pics.me.me/dont-xd-350-penalty-30971828.png";

const table = [
    "xd",
];

export default {
    async run({ message }) {
        if (message.author.bot) return;

        const { content, channel } = message;
        const words = content.toLowerCase().split(" ");

        let shouldDelete = false;
        words.forEach((word) => {
            if (table.includes(word)) {
                shouldDelete = true;
                return;
            }
        });

        if (shouldDelete) {
            message.delete().catch(() => { });
            const reply = await channel.send(imgUrl);
            setTimeout(() => reply.delete(), 5000);
        }
    }
}