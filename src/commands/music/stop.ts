import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'stop',
    description: 'Stop the player',
    run: async ({ interaction }) => {
        const { guildId } = interaction;
        const { player } = client;
        const queue = player.getQueue(guildId);

        if (!queue || !queue.playing)
            return await interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        queue.destroy();
        await interaction.reply({ content: "🛑 | Stopped the player!" });
    }
})