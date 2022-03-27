import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'nowplaying',
    description: 'Now Playing',
    run: async ({ interaction }) => {
        const { guildId, followUp } = interaction;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return void followUp({ content: "❌ | No music is being played!" });
        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return void followUp({
            embeds: [
                {
                    title: "Now Playing",
                    description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: "\u200b",
                            value: progress
                        }
                    ],
                    color: 0xffffff
                }
            ]
        });
    }
})