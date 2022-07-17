import { GuildEmoji } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";

var memeCoin: GuildEmoji = null;

const events = [
    new Event('ready', async () => {
        memeCoin = client.emojis.cache.find(emoji => emoji.name === "memecoin");
    }),
    new Event('messageReactionAdd', async (messageReaction, user) => {
        if (user.bot) return;
        if (!memeCoin || messageReaction.emoji.id !== memeCoin.id) return;
        //console.log(`${user} add reacted with ${memeCoin}`);
    }),
    new Event('messageReactionRemove', async (messageReaction, user) => {
        if (user.bot) return;
        if (!memeCoin || messageReaction.emoji.id !== memeCoin.id) return;
        //console.log(`${user} remove reacted with ${memeCoin}`);
    })
];

export default events;