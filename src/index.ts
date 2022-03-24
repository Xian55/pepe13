require("dotenv").config()

import { ExtendedClient } from "./structures/Client";
import { connectDatabase } from "./database/connectDatabase";

export const client = new ExtendedClient();

(async () => {
    await connectDatabase();
    client.start();
})();