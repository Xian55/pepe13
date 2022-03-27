import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'queue',
    description: "See the queue",
    run: async ({ interaction }) => {
        const { guildId } = interaction;
        const queue = player.getQueue(guildId);
        if (!queue || !queue.playing)
            return void interaction.followUp({ content: "❌ | No music is being played!" });
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. **${m.title}** ([link](${m.url}))`;
        });

        return void interaction.followUp({
            embeds: [
                {
                    title: "Server Queue",
                    description: `${tracks.join("\n")}${queue.tracks.length > tracks.length
                        ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
                        : ""
                        }`,
                    color: 0xff0000,
                    fields: [{ name: "Now Playing", value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))` }]
                }
            ]
        });
    }
})