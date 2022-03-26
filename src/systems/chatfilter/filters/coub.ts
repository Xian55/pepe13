import path from "path";
import fs from "fs";
import util from 'util';

export default {
    async run({ message }) {
        const { content } = message;
        let regex = /https:\/\/(www\.|)coub\.com\/(view|embed)\//im;
        if (!regex.test(content)) return;

        let safeUrl = content.replace(/[||]/g, '');
        let spoiler = content != safeUrl;

        console.log(`processing ${safeUrl}`);

        let serverPath = `${__dirname}./../../../../tmp/`;
        let id = safeUrl.split('/').pop();
        let savePath = path.join(serverPath, (spoiler ? 'SPOILER_' : '') + id + '.mp4');

        let cmd = `coub-dl -i ${safeUrl} -o ${savePath} --format mp4 --scale 400 --loop 10 --time 12`; // -C
        await execAsync(cmd);

        if (!fs.existsSync(savePath)) {
            console.log(`file ${savePath} not exists!`);
            return;
        }

        await message.channel.send(
            {
                files: [
                    {
                        attachment: savePath,
                        name: `${id}.mp4`,
                        description: (spoiler ? '**NSFW** - ' : '') + content
                    }
                ]
            }).then(async rsp => {
                await message.delete({ timeout: 1000 })
                    .then(() => console.log(`Deleted request of ${content}`))
                    .catch(console.error);

                //if (memeCoin != null)
                //    await rsp.react(memeCoin.id);

            }).catch(console.log);

        deleteFile(savePath);
    }
}


async function execAsync(cmd) {
    try {
        const exec = util.promisify(require('child_process').exec);

        console.log(`execAsync-${cmd}`);
        //const { stdout, stderr } = await exec(`whoami && ${cmd}`);
        const { stdout, stderr } = await exec(cmd);
        console.log(`execAsync-finish`);
        if (stdout.length > 0)
            console.log('[coub-dl] stdout:', stdout);

        if (stderr.length > 0)
            console.log('[coub-dl] stderr:', stderr);
    } catch (e) {
        console.log('[coub-dl] error:', e); // should contain code (exit code) and signal (that caused the termination).
    }
}

function deleteFile(path) {
    if (fs.existsSync(path)) {
        try {
            fs.unlinkSync(path);
        } catch (err) {
            console.error(err);
        }
    }
}