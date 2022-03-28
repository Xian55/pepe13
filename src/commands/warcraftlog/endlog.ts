import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

const ironforgeBaseURL = "https://ironforge.pro/analyzer/report/"
const regexLog = /https:\/\/classic\.warcraftlogs\.com\/reports\/(.*)\//;

export default new Command({
    name: "endlog",
    description: "Ends the live warcraftlog! Inserts ironforge link.",
    options: [
        {
            name: "message_id",
            description: `Message id with contains the warcraft log bot message.`,
            type: "STRING",
            required: true
        },
        {
            name: "title",
            description: `The title of the the event`,
            type: "STRING",
            required: false
        }
    ],
    run: async ({ interaction, args }) => {
        const { channel } = interaction;

        const title = args.getString("title") || "warcraftlog";

        const messageId = args.getString("message_id");
        const message = await channel.messages.fetch(messageId);
        if (!message) return;

        await interaction
            .followUp({ content: 'ironforge link added to the log!', ephemeral: true })
            .then((reply) => {
                setTimeout(() => (reply as Message).delete(), 4000);
            });

        const { embeds } = message;

        if (embeds.length != 1)
            return interaction
                .followUp({ content: "not suported", ephemeral: true });

        const { url, description } = embeds[0];

        if (!regexLog.test(url))
            return interaction
                .followUp({ content: "invalid embed link", ephemeral: true });

        const match = url.match(regexLog);
        const id = match[1];

        if (!id)
            return interaction
                .followUp({ content: "format change?!", ephemeral: true });;

        embeds[0].thumbnail = null;

        if (embeds[0].title.length == 0) {
            if (description && description.length == 0) {
                embeds[0].title = title;
            }
            else {
                embeds[0].title = description;
            }
        }

        const ironforgeURL = ironforgeBaseURL + id + "/";
        const forgeEmbed = new MessageEmbed()
            .setTitle("consumable usage")
            .setURL(ironforgeURL);

        embeds.push(forgeEmbed);

        await interaction.followUp({ embeds: embeds }).then(() => {
            setTimeout(() => (message as Message).delete(), 4000);
        });
    }
})