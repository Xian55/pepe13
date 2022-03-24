import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";
import { client } from "../index"

import initFilters from "../systems/chatFilter"

export default new Event('ready', async () => {
    logHandler.log("info", "Bot is online");

    initFilters(client);
})