import filter, { FilterInt } from "../../schemas/filter";
import { ExtendedClient } from "../../structures/Client";
import { logHandler } from "../../utils/logHandler";
import path from "path"
import glob from "glob";
import { promisify } from "util";
import { IChatFilter } from "../../typings/ChatFilter";

const globPromise = promisify(glob)

export default async (client: ExtendedClient) => {

    const files = await globPromise(`${__dirname}/../filters/*{.ts,.js}`);
    files.forEach(async filePath => {
        const basename = path.basename(filePath, '.ts');
        const filter: IChatFilter = await client.importFile(filePath);
        client.chatFilter.filters.set(basename, filter);
        logHandler.log("debug", `Added ${basename} -> ${filePath}`);
    });

    filter.find().then((documents) => {
        documents.forEach((doc) => {
            client.chatFilter.populate(doc as FilterInt);
            logHandler.log("debug", `ChatFilter [${doc.Handler}] ${doc.Guild} ${doc.Channel} -> ${doc.Words}`)
        })
    })
}