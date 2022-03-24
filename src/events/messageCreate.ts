import { client } from "..";
import { Event } from "../structures/Events";

const imgUrl = "https://pics.me.me/dont-xd-350-penalty-30971828.png";

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;

    const { content, guild, author, channel } = message;
    const words = content.toLowerCase().split(" ");

    const Filter = client.filters.get(guild.id);
    if (!Filter) return;

    const wordsUsed: string[] = [];
    let shouldDelete = false;

    words.forEach((word) => {
        if (Filter.includes(word)) {
            wordsUsed.push(word);
            shouldDelete = true;
        }
    });

    if (shouldDelete) {
        const channel = message.channel;
        message.delete().catch(() => { });

        const reply = await channel.send(imgUrl);
        setTimeout(() => reply.delete(), 5000);
    }
})