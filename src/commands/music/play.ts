import { Command } from "../../structures/Command";
import { client } from "../..";
import { QueryType } from "discord-player";

export default new Command({
    name: 'play',
    description: 'Plays a song',
    options: [
        {
            name: 'query',
            type: 'STRING' as const,
            description: '(YouTube, Spotify, SoundCloud) link or (search term)',
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const {
            options,
            channel,
            member,
            user,
            commandName,
            guild,
            guildId } = interaction;

        const query = options.getString("query");
        const { player } = client;
        const searchResult = await player
            .search(query, {
                requestedBy: user,
                searchEngine: commandName === "soundcloud" ?
                    QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO
            })
            .catch(console.warn);

        if (!searchResult || !searchResult.tracks.length)
            return await interaction.reply({ content: "No results were found!", ephemeral: true });

        const queue = player.createQueue(guild, {
            metadata: channel,
            autoSelfDeaf: false,
            bufferingTimeout: 0,
            initialVolume: 25,
            volumeSmoothness: 0.1
        });

        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
        } catch {
            player.deleteQueue(guildId);
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        if (searchResult.playlist) {
            await interaction.reply({ content: `⏱ | Loading playlist...` });
        }
        else {
            await interaction.deferReply();
            await interaction.deleteReply();
        }

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    }
})