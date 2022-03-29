import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'nowplaying',
    description: 'Now Playing',
    run: async ({ interaction }) => {
        const { guildId } = interaction;
        const queue = player.getQueue(guildId);

        if (!queue || !queue.playing)
            return interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        await interaction.reply({
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