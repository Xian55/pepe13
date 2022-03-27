import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'resume',
    description: 'Resume the current song',
    run: async ({ interaction }) => {
        const { guildId, followUp } = interaction;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return void followUp({ content: "❌ | No music is being played!" });
        const paused = queue.setPaused(false);
        return void followUp({ content: !paused ? "❌ | Something went wrong!" : "▶ | Resumed!" });
    }
})