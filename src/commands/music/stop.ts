import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'stop',
    description: 'Stop the player',
    run: async ({ interaction }) => {
        const { guildId, followUp } = interaction;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return void followUp({ content: "❌ | No music is being played!" });
        queue.destroy();
        return void followUp({ content: "🛑 | Stopped the player!" });
    }
})