import { Collection, Message } from "discord.js";
import { FilterInt } from "../schemas/filter";
import { ExtendedClient } from "../structures/Client";

export class ChatFilter {
    channels: Collection<string, string> = new Collection();
    handlers: Collection<string, string[]> = new Collection();
    words: Collection<string, string[]> = new Collection();

    filters: Collection<string, IChatFilter> = new Collection();

    populate(doc: FilterInt) {
        this.channels.set(doc.Guild, doc.Channel);
        this.words.set(doc.Guild, doc.Words);

        let handlers: string[] = this.handlers.get(doc.Channel) || [];
        handlers.push(doc.Handler)
        this.handlers.set(doc.Channel, handlers);
    }
}

interface RunOptions {
    client: ExtendedClient,
    message: Message
}

type RunFunction = (options: RunOptions) => any;

export interface IChatFilter {
    run: RunFunction;
}