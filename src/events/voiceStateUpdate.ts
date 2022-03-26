import { NewsChannel, VoiceState } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";
import { logHandler } from "../utils/logHandler";

import Schema from "../schemas/welcome";

export default new Event('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    if (newState.id == client.user.id || !newState.channelId) return;

    const { guild, id } = newState

    const data = await Schema.findOne(
        { Guild: guild.id, Member: id }
    );
    if (!data) return;

    console.log("TODO: play my welcome");
})