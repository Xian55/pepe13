import { client } from "..";
import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";

export default [new Event('ready', async () => {
    logHandler.log("info", `Ready with ${process.env.environment} env`);

    client.user.setActivity({
        name: "send /help",
        type: "LISTENING"
    });
})]