import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";
import { CronJob } from 'cron';
import path from "path";
import fs from "fs";
import { client } from "..";
import { TextChannel } from "discord.js";

export default [new Event('ready', async () => {
    let job = new CronJob('0 4 * * MON', task);
    job.start();
})];

const n = 4;

async function task() {
    const file = `it_be_monday_${Math.floor(Math.random() * n)}.mp4`;
    const mondayFile = path.resolve(process.env.user_path, file);
    if (!fs.existsSync(mondayFile)) return;

    const { channels } = client;
    const channel = await channels.fetch(process.env.plebek_post) as TextChannel; // playground - 789904472863146047
    if (!channel) return;

    channel.send(
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