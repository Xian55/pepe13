import { VoiceState } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";

import { QueryType } from "discord-player";
import Schema from "../schemas/welcome";

const { player } = client;

export default new Event('voiceStateUpdate',
    async (oldState: VoiceState, newState: VoiceState) => {
        if (newState.id == client.user.id ||
            !newState.channelId ||
            oldState.channelId == newState.channelId) return;

        const { guild, id, channel } = newState

        const data = await Schema.findOne(
            { Guild: guild.id, Member: id }
        );
        if (!data) return;

        const { Link } = data;

        const searchResult = await player
            .search(Link, {
                requestedBy: newState.member.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            .catch(console.warn);

        if (!searchResult || !searchResult.tracks.length) return;

        const queue = player.createQueue(guild, {
            metadata: channel,
            autoSelfDeaf: false,
            bufferingTimeout: 500,
            initialVolume: 50
        });

        try {
            if (!queue.connection)
                await queue.connect(channel);
        } catch (e) {
            void player.deleteQueue(guild.id);
            console.log(e);
        }

        logHandler.log("debug", `⏱ | Loading ${Link} as welcome ...`)
        if (!queue.playing)
            await queue.play(searchResult.tracks[0]);
    })