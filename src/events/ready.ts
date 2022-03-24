import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";

export default new Event('ready', async () => {
    logHandler.log("info", "Bot is online");
})