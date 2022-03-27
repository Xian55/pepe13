import { Collection, Message } from "discord.js";
import { FilterInt } from "../schemas/filter";
import { ExtendedClient } from "../structures/Client";

export class ChatFilter {
    channels: Collection<string, string> = new Collection();
    handlers: Collection<string, string[]> = new Collection();
    words: Collection<string, string[]> = new Collection();

    filters: Collection<string, IChatFilter> = new Collection();

    populate(doc: FilterInt) {
        const { Guild, Channel, Words, Handler } = doc;
        this.channels.set(Guild, Channel);
        this.words.set(Guild, Words);

        let handlers: string[] = this.handlers.get(Channel) || [];
        handlers.push(Handler)
        this.handlers.set(Channel, handlers);
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