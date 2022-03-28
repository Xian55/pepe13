import filter, { FilterInt } from "../../schemas/filter";
import { ExtendedClient } from "../../structures/Client";
import { logHandler } from "../../utils/logHandler";
import path from "path"
import glob from "glob";
import { promisify } from "util";
import { IChatFilter } from "../../typings/ChatFilter";

const globPromise = promisify(glob)

export default async (client: ExtendedClient) => {
    const { chatFilter } = client;
    const files = await globPromise(`${__dirname}/filters/*{.ts,.js}`);
    files.forEach(async file => {
        const filter: IChatFilter = await client.importFile(file);
        const fileName = path.parse(file).name;
        chatFilter.filters.set(fileName, filter);
        if (process.env.environment == "debug")
            logHandler.log("debug", `Added ${fileName} -> ${file}`);
    });

    filter.find().then((documents) => {
        documents.forEach((doc) => {
            chatFilter.populate(doc as FilterInt);
        })
    })
}