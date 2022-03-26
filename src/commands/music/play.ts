import { Command } from "../../structures/Command";
import { client } from "../..";
import { QueryType } from "discord-player";

const { player } = client;

export default new Command({
    name: 'play',
    description: 'Plays a song',
    options: [
        {
            name: 'query',
            type: 'STRING' as const,
            description: 'The URL of the song to play',
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const query = interaction.options.getString("query");
        const searchResult = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: interaction.commandName === "soundcloud" ? QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO
            })
            .catch(console.warn);
        if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: "No results were found!" });

        const queue = player.createQueue(interaction.guild, {
            metadata: interaction.channel,
            autoSelfDeaf: false
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            void player.deleteQueue(interaction.guildId);
            return void interaction.followUp({ content: "Could not join your voice channel!" });
        }

        await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...` });
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    }
})