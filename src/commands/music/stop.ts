import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'stop',
    description: 'Stop the player',
    run: async ({ interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
        queue.destroy();
        return void interaction.followUp({ content: "🛑 | Stopped the player!" });
    }
})