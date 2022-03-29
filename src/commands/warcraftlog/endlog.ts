import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

const ironforgeBaseURL = "https://ironforge.pro/analyzer/report/"
const regexLog = /https:\/\/classic\.warcraftlogs\.com\/reports\/(.*)\//;

export default new Command({
    name: "endlog",
    description: "Ends the live warcraftlog. Inserts ironforge analyzer link.",
    options: [
        {
            name: "message_id",
            description: `Message id which submitted by warcraft log webhook.`,
            type: "STRING",
            required: true
        },
        {
            name: "title",
            description: `[Only used when report description was empty. The title of the the event]`,
            type: "STRING",
            required: false
        }
    ],
    run: async ({ interaction }) => {
        const { options, channel } = interaction;

        const messageId = options.getString("message_id");
        const message = await channel.messages.fetch(messageId);
        if (!message) return;

        const date = new Date(message.createdTimestamp);
        const customTitle = options.getString("title") || `${formatDate(date)} log`;

        await interaction
            .followUp({ content: 'Live log ended. Safe to open Ironforge link!', ephemeral: true })
            .then((reply) => {
                setTimeout(() => (reply as Message).delete(), 4000);
            });

        const { embeds } = message;

        if (embeds.length != 1)
            return interaction
                .followUp({ content: "not suported", ephemeral: true });

        const embed = embeds[0];
        const { url, description } = embed;

        if (!regexLog.test(url))
            return interaction
                .followUp({ content: "invalid embed link", ephemeral: true });

        const match = url.match(regexLog);
        const id = match[1];

        if (!id)
            return interaction
                .followUp({ content: "format change?!", ephemeral: true });


        embed.thumbnail = null;

        if (description) {
            embed.title = description;
            embed.description = null;
        }
        else {
            embed.title = customTitle;
        }

        const ironforgeURL = ironforgeBaseURL + id + "/";
        const forgeEmbed = new MessageEmbed()
            .setTitle(`${embed.title} consumables`)
            .setURL(ironforgeURL);

        embeds.push(forgeEmbed);

        await interaction.followUp({ embeds: embeds }).then(() => {
            setTimeout(() => (message as Message).delete(), 4000);
        });
    }
})

function formatDate(date: Date) {
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return `${month} ${day}`;
}