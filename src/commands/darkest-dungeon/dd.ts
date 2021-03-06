import { Permissions } from "discord.js";
import { Command } from "../../structures/Command";
import { client } from "../..";
import { Track, RawTrackData } from "discord-player";
import path from "path";
import fs from "fs";

const dataPath = path.resolve(process.env.data_path, "darkest");
const mapFile = "map.json";
const voicePath = "voice-data";

export default new Command({
    name: 'dd',
    description: 'Returns with a Darkest Dungeon quote',
    botPermissions: [
        Permissions.FLAGS.CONNECT
    ],
    options: [
        {
            name: 'query',
            type: 'STRING' as const,
            description: '[search term]',
            required: false,
        },
    ],
    run: async ({ interaction }) => {
        const { options, member, guild, guildId, channel } = interaction;
        const query = options.getString("query");
        const { key, description } = findBestQuote(query);
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
                await queue.connect(member.voice.channel);
        } catch {
            player.deleteQueue(guildId);
            return interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        const filePath = path.join(dataPath, voicePath, key);
        if (!fs.existsSync(filePath))
            return await interaction.reply({ content: "file does not exists!", ephemeral: true });

        // slient reply
        await interaction.deferReply();
        await interaction.deleteReply();

        const raw = {
            engine: () => fs.createReadStream(filePath)
        }

        const data: RawTrackData = {
            title: description,
            description: "file:\\",
            author: "file:\\",
            url: filePath,
            thumbnail: "file:\\",
            duration: "10",
            views: 0,
            requestedBy: member.user,
            source: "arbitrary",
            raw: raw
        };

        const track = new Track(player, data);
        queue.addTrack(track);
        if (!queue.playing) await queue.play();
    }
})

function findBestQuote(suffix: string) {
    let db = require(path.join(dataPath, mapFile));
    let highestScore = 0;
    let bestKey: string;

    if (!suffix || suffix.length == 0) {
        bestKey = randomKey(db);
    } else {
        for (var key in db) {
            let value = similarity(db[key], suffix);

            if (value > highestScore) {
                highestScore = value;
                bestKey = key;
            }
        }
    }

    return { key: bestKey, description: db[bestKey] };
}

const randomKey = function (obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
