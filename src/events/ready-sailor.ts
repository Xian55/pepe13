import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";
import { CronJob } from 'cron';
import path from "path";
import fs from "fs";
import { client } from "..";
import { TextChannel } from "discord.js";

export default [new Event('ready', async () => {
    if (!fs.existsSync(mondayFile)) return;
    let job = new CronJob('0 4 * * MON', task);
    job.start();
})];

const file = "it_be_monday.mp4";
const mondayFile = path.resolve(process.env.user_path, file);

async function task() {
    const channel = await client.channels.fetch(process.env.plebek_post); // playground - 789904472863146047
    if (!channel) return;
    const textChannel = channel as TextChannel;

    textChannel.send(
        {
            files: [
                {
                    attachment: mondayFile,
                    name: file,
                    description: file
                }
            ]
        }
    );

}