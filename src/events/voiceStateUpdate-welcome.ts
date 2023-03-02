import { Permissions, VoiceState } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";
import { hasPermission } from "../utils/hasPermission";

import { RawTrackData, Track } from "discord-player";
import Schema from "../schemas/welcome";

const botPermissions = [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT];

export default [new Event('voiceStateUpdate',
    async (oldState: VoiceState, newState: VoiceState) => {
        if (newState.id == client.user.id ||
            !newState.channelId ||
            oldState.channelId == newState.channelId)
            return;

        const { guild, id, channel, member } = newState

        if (!hasPermission(guild.members.me, channel, botPermissions)) {
            logHandler.log("error", `Unable to join **${channel.name}** missing permission!`);
            return;
        }

        const data = await Schema.findOne(
            { Guild: guild.id, Member: id }
        );
        if (!data) return;
        const { Link } = data;

        const { player } = client;
        const queue = player.createQueue(guild, {
            metadata: channel,
            autoSelfDeaf: false,
            bufferingTimeout: 0,
            initialVolume: 25,
            volumeSmoothness: 0.1
        });

        try {
            if (!queue.connection)
                await queue.connect(channel);
        } catch (e) {
            player.deleteQueue(guild.id);
            console.log(e);
        }

        const trackData: RawTrackData = {
            title: "",
            description: "",
            author: "",
            url: Link,
            thumbnail: "",
            duration: "10",
            views: 0,
            requestedBy: member.user,
            source: "youtube"
        };

        const track = new Track(player, trackData);
        queue.addTrack(track);

        if (!queue.playing)
            await queue.play();

        logHandler.log("debug", `⏱ | Loading ${Link} as welcome ...`)
    })]