import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'skip',
    description: 'Skip to the current song',
    run: async ({ interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
        const currentTrack = queue.current;
        const success = queue.skip();
        return void interaction.followUp({
            content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!"
        });
    }
})