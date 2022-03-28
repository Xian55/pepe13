import { client } from "..";
import { Event } from "../structures/Events";

const { chatFilter } = client;

export default [new Event('messageCreate', async (message) => {
    const { guild, channel } = message;
    const { channels, handlers, filters } = chatFilter;

    const channelHasFilter = channels.get(guild.id);
    if (!channelHasFilter) return;

    const channelHandlers = handlers.get(channel.id);
    channelHandlers.forEach((handler) => {
        filters.get(handler)?.run({ client, message });
    });
})]