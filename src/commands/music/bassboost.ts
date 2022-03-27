import { Command } from "../../structures/Command";
import { client } from "../..";
import { QueueRepeatMode } from "discord-player";

const { player } = client;

export default new Command({
    name: 'bassboost',
    description: 'Toggles bassboost filter',
    run: async ({ interaction }) => {
        const { guildId, followUp } = interaction;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return void followUp({ content: "❌ | No music is being played!" });

        let state = queue.getFiltersEnabled().includes("bassboost");
        await queue.setFilters({
            bassboost: !state,
            normalizer2: !state // because we need to toggle it with bass
        });
        let newState = queue.getFiltersEnabled().includes("bassboost");

        return void followUp({ content: `🎵 | Bassboost ${newState ? "Enabled" : "Disabled"}!` });
    }
})