import path from "path";
import fs from "fs";
import util from 'util';
import { Permissions, Message, TextChannel } from "discord.js";
import ChildProcess from "child_process";
import { logHandler } from "../../../utils/logHandler";
import { errorHandler } from "../../../utils/errorHandler";
import { hasPermission } from "../../../utils/hasPermission";

const exec = util.promisify(ChildProcess.exec);

export default {
    async run({ message }: { message: Message }) {
        if (message.author.bot) return;
        const { guild, channel, content } = message;

        const regex = /https:\/\/(www\.|)coub\.com\/(view|embed)\/([^\s]+)/im;
        if (!regex.test(content)) return;

        if (!hasPermission(guild.me, channel as TextChannel, [Permissions.FLAGS.SEND_MESSAGES])) {
            logHandler.log("error", `${path.basename(__filename)} Dont have permission in ${channel}`);
            return;
        }

        const safeContent = content.replace(/[||]/g, '');
        const spoiler = content != safeContent;

        //console.log(`processing ${safeUrl}`);

        const match = content.match(regex);
        const url = match[0];
        const id = match[3];

        const fileName = (spoiler ? 'SPOILER_' : '') + id + '.mp4';
        const savePath = path.join(process.env.tmp_path, fileName);

        const cmd = `coub-dl -i ${url} -o ${savePath} --format mp4 --scale 400 --loop 10 --time 10`;
        await execAsync(cmd);

        if (!fs.existsSync(savePath)) {
            logHandler.log("error", `${path.basename(__filename)} ${savePath} not exists!`);
            return;
        }

        await message.reply({
            files: [
                {
                    attachment: savePath,
                    name: fileName,
                }
            ]
        });

        deleteFile(savePath);
    }
}


async function execAsync(cmd: string) {
    try {
        //console.log(`[coub-dl] execAsync-star-${cmd}`);
        const { stdout, stderr } = await exec(cmd);
        //console.log(`[coub-dl] execAsync-finish`);
        if (stdout.length > 0)
            logHandler.log("info", `[coub-dl] stdout: ${stdout}`);

        if (stderr.length > 0)
            logHandler.log("error", `[coub-dl] stderr: ${stderr}`);
    }
    catch (e) {
        errorHandler("[coub-dl] error", e);
    }
}

function deleteFile(path: string) {
    if (fs.existsSync(path)) {
        try {
            fs.unlinkSync(path);
        } catch (e) {
            errorHandler("delete file", e);
        }
    }
}