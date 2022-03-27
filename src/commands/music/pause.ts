import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'pause',
    description: 'Pause the current song',
    run: async ({ interaction }) => {
        const { guildId, followUp } = interaction;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return void followUp({ content: "❌ | No music is being played!" });
        const paused = queue.setPaused(true);
        return void followUp({ content: paused ? "⏸ | Paused!" : "❌ | Something went wrong!" });
    }
})