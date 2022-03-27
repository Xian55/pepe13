import { Command } from "../../structures/Command";
import { client } from "../..";

const { player } = client;

export default new Command({
    name: 'ping',
    description: 'replies with pong',
    run: async ({ interaction }) => {
        const { guild } = interaction;
        const queue = player.getQueue(guild);

        return void interaction.followUp({
            embeds: [
                {
                    title: "⏱️ | Latency",
                    fields: [
                        { name: "Bot Latency", value: `\`${Math.round(client.ws.ping)}ms\`` },
                        { name: "Voice Latency", value: !queue ? "N/A" : `UDP: \`${queue.connection.voiceConnection.ping.udp ?? "N/A"}\`ms\nWebSocket: \`${queue.connection.voiceConnection.ping.ws ?? "N/A"}\`ms` }
                    ],
                    color: 0xFFFFFF
                }
            ]
        });
    }
})