import { Event } from "../structures/Events";

const badWords = [
    "xd",
    "☓d",
    "×d",
    "ᵡᴰ"
];

const imgUrl = "https://pics.me.me/dont-xd-350-penalty-30971828.png";

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;

    const { content, guild, author, channel } = message;
    const words = content.toLowerCase().split(" ");

    let shouldDelete = false;
    for (let word of words) {
        if (badWords.includes(word)) {
            shouldDelete = true;
            break;
        }
    }

    if (shouldDelete) {
        const channel = message.channel;
        message.delete().catch(() => { });

        const reply = await channel.send(imgUrl);
        setTimeout(() => reply.delete(), 5000);
    }
})