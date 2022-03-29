import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'resume',
    description: 'Resume the current song',
    run: async ({ interaction }) => {
        const { guildId } = interaction;
        const queue = player.getQueue(guildId);

        if (!queue || !queue.playing)
            return await interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        const paused = queue.setPaused(false);
        await interaction.reply({ content: !paused ? "❌ | Something went wrong!" : "▶ | Resumed!" });
    }
})