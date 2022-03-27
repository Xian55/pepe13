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
        const {
            options,
            channel,
            member,
            user,
            commandName,
            guild,
            guildId,
            followUp,
            deleteReply } = interaction;

        const query = options.getString("query");

        const searchResult = await player
            .search(query, {
                requestedBy: user,
                searchEngine: commandName === "soundcloud" ?
                    QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO
            })
            .catch(console.warn);

        if (!searchResult || !searchResult.tracks.length)
            return void followUp({ content: "No results were found!" });

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
            void player.deleteQueue(guildId);
            return void followUp({ content: "Could not join your voice channel!" });
        }

        if (searchResult.playlist) {
            await followUp({ content: `⏱ | Loading playlist...` });
        }
        else {
            await followUp({ content: "done" });
            deleteReply();
        }

        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    }
})