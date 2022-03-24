const imgUrl = "https://pics.me.me/dont-xd-350-penalty-30971828.png";

const table = [
    "xd",
];

export default {
    async run({ message }) {
        const { content } = message;
        const words = content.toLowerCase().split(" ");

        let shouldDelete = false;

        words.forEach((word) => {
            if (table.includes(word)) {
                shouldDelete = true;
                return;
            }
        });

        if (shouldDelete) {
            const channel = message.channel;
            message.delete().catch(() => { });

            const reply = await channel.send(imgUrl);
            setTimeout(() => reply.delete(), 5000);
        }
    }
}