import filter from "../schemas/filter";
import { ExtendedClient } from "../structures/Client";
import { logHandler } from "../utils/logHandler";

export default (client: ExtendedClient) => {
    filter.find().then((documents) => {
        documents.forEach((doc) => {

            client.filters.set(doc.Guild, doc.Words);
            client.filtersLog.set(doc.Guild, doc.Log);

            logHandler.log("info", `chatFilter on ${doc.Guild} -> ${doc.Words}`)
        })
    })
}