import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'bassboost',
    description: 'Toggles bassboost filter',
    run: async ({ interaction }) => {
        const { guildId } = interaction;
        const queue = player.getQueue(guildId);

        if (!queue || !queue.playing)
            return await interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        let oldState = queue.getFiltersEnabled().includes("bassboost");
        await queue.setFilters({
            bassboost: !oldState,
            normalizer2: !oldState // because we need to toggle it with bass
        });
        let newState = queue.getFiltersEnabled().includes("bassboost");

        await interaction.reply({ content: `🎵 | Bassboost \`${newState ? "Enabled" : "Disabled"}\`!` });
    }
})