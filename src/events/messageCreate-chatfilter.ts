import { client } from "..";
import { Event } from "../structures/Events";

export default [new Event('messageCreate', async (message) => {
    const { guild, channel } = message;
    const channelHasFilter = client.chatFilter.channels.get(guild.id);
    if (!channelHasFilter) return;

    let handlers = client.chatFilter.handlers.get(channel.id);
    handlers.forEach((handler) => {
        client.chatFilter.filters.get(handler)?.run({ client, message });
    });
})]