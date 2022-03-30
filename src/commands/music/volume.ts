import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'volume',
    description: "Sets music volume",
    options: [
        {
            name: "amount",
            type: "INTEGER",
            description: "[The volume amount to set (0-100)]",
            required: false
        }
    ],
    run: async ({ interaction }) => {
        const { guildId, options } = interaction;
        const { player } = client;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return await interaction.reply({ content: "❌ | No music is being played!", ephemeral: true });

        const vol = options.getInteger("amount");
        if (!vol)
            return await interaction.reply({ content: `🎧 | Current volume is **${queue.volume}**%!` });

        if ((vol) < 0 || (vol) > 100)
            return await interaction.reply({ content: "❌ | Volume range must be 0-100", ephemeral: true });

        const success = queue.setVolume(vol);
        await interaction.reply({
            content: success ? `✅ | Volume set to **${vol}%**!` : "❌ | Something went wrong!"
        });
    }
})