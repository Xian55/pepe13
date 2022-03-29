import { Command } from "../../structures/Command";
import { client } from "../..";
import { QueueRepeatMode } from "discord-player";

const { player } = client;

export default new Command({
    name: 'loop',
    description: 'Sets loop mode',
    options: [
        {
            name: "mode",
            type: "INTEGER",
            description: "Loop type",
            required: true,
            choices: [
                {
                    name: "Off",
                    value: QueueRepeatMode.OFF
                },
                {
                    name: "Track",
                    value: QueueRepeatMode.TRACK
                },
                {
                    name: "Queue",
                    value: QueueRepeatMode.QUEUE
                },
                {
                    name: "Autoplay",
                    value: QueueRepeatMode.AUTOPLAY
                }
            ]
        }
    ],
    run: async ({ interaction }) => {
        const { guildId, options } = interaction;
        const queue = player.getQueue(guildId);

        if (!queue || !queue.playing)
            return await interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        const loopMode = options.getInteger("mode") as QueueRepeatMode;
        const success = queue.setRepeatMode(loopMode);

        const mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
        await interaction.reply({ content: success ? `${mode} | Updated loop mode!` : "❌ | Could not update loop mode!" });
    }
})