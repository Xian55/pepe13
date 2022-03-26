import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'volume',
    description: "Sets music volume",
    options: [
        {
            name: "amount",
            type: "INTEGER",
            description: "The volume amount to set (0-100)",
            required: true
        }
    ],
    run: async ({ interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });

        const vol = interaction.options.getInteger("amount");

        if (!vol) return void interaction.followUp({ content: `🎧 | Current volume is **${queue.volume}**%!` });
        if ((vol) < 0 || (vol) > 100) return void interaction.followUp({ content: "❌ | Volume range must be 0-100" });
        const success = queue.setVolume(vol);
        return void interaction.followUp({
            content: success ? `✅ | Volume set to **${vol}%**!` : "❌ | Something went wrong!"
        });
    }
})