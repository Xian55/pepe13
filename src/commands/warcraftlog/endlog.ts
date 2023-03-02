import { Permissions, Message, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { hasPermission } from "../../utils/hasPermission";

const ironforgeBaseURL = "https://ironforge.pro/analyzer/report/"
const regexLog = /https:\/\/classic\.warcraftlogs\.com\/reports\/(.*)/;

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
            name: "custom_title",
            description: `[Only used when the report description was empty.]`,
            type: "STRING",
            required: false
        }
    ],
    run: async ({ interaction }) => {
        const { guild, options, channel } = interaction;

        const messageId = options.getString("message_id");
        let message: Message;
        try {
            message = await channel.messages.fetch(messageId);
            if (!message) return await interaction
                .reply({ content: "**error:** message not found", ephemeral: true });
        } catch (e) {
            return await interaction
                .reply({ content: `**${e.toString()}**`, ephemeral: true });
        }

        const date = new Date(message.createdTimestamp);
        const custom_title = options.getString("custom_title") || `${formatDate(date)} log`;

        const { embeds } = message;

        if (embeds.length != 1)
            return interaction
                .reply({ content: "**error:** not suported", ephemeral: true });

        const embed = embeds[0];
        const { url, description } = embed;

        if (!regexLog.test(url))
            return interaction
                .reply({ content: "**error:** invalid embed link", ephemeral: true });

        const match = url.match(regexLog);
        const id = match[1];

        if (!id)
            return interaction
                .reply({ content: "**error:** format changed?!", ephemeral: true });

        embed.thumbnail = null;

        if (description) {
            embed.title = description;
            embed.description = null;
        }
        else {
            embed.title = custom_title;
        }

        const ironforgeURL = ironforgeBaseURL + id + "/";
        const forgeEmbed = new MessageEmbed()
            .setTitle(`${embed.title} consumables`)
            .setURL(ironforgeURL);

        embeds.push(forgeEmbed);

        await interaction.reply({ embeds: embeds });
        await interaction.followUp({ content: "Original message will be deleted!", ephemeral: true });

        if (hasPermission(guild.members.me, channel as TextChannel, [Permissions.FLAGS.MANAGE_MESSAGES])) {
            setTimeout(() => message.delete(), 4000);
        }
        else {
            await interaction.followUp({ content: "Don't have permission to delete the original message!", ephemeral: true });
        }
    }
})

function formatDate(date: Date) {
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return `${month} ${day}`;
}