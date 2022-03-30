import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'skip',
    description: 'Skip to the current song',
    run: async ({ interaction }) => {
        const { guildId } = interaction;
        const { player } = client;
        const queue = player.getQueue(guildId);

        if (!queue || !queue.playing)
            return await interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        const currentTrack = queue.current;
        const success = queue.skip();
        await interaction.reply({
            content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!"
        });
    }
})