import { Collection, Message } from "discord.js";
import { FilterInt } from "../schemas/filter";
import { logHandler } from "../utils/logHandler";

export class ChatFilter {
    channels: Collection<string, string> = new Collection();
    handlers: Collection<string, string[]> = new Collection();
    words: Collection<string, string[]> = new Collection();

    filters: Collection<string, Filter> = new Collection();

    populate(doc: FilterInt) {
        const { Guild, Channel, Words, Handler } = doc;
        this.channels.set(Guild, Channel);
        this.words.set(Guild, Words);

        const handlers: string[] = this.handlers.get(Channel) || [];
        handlers.push(Handler)
        this.handlers.set(Channel, handlers);

        if (process.env.environment == "debug")
            logHandler.log("debug", `ChatFilter ${Guild} ${Channel} [${Handler}] -> ${Words}`)
    }
}

interface FilterRunOptions {
    message: Message
}

type RunFunction = (options: FilterRunOptions) => void;

export interface Filter {
    run: RunFunction;
}