import { Command } from "../../structures/Command";
import { client } from "../..";

export default new Command({
    name: 'ping',
    description: 'replies with pong',
    run: async ({ interaction }) => {
        const { guild } = interaction;
        const { player } = client;
        const queue = player.getQueue(guild);

        await interaction.reply({
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