import { TextChannel, Permissions } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../typings/Commands";
import { errorHandler } from "../utils/errorHandler";
import { hasPermission } from "../utils/hasPermission"

const { commands } = client;

export default [new Event('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const command = commands.get(commandName)
    if (!command) {
        return await interaction.reply(
            {
                content: "You have used a non existing command",
                ephemeral: true
            });
    }

    if (interaction.inGuild()) {
        const { guild, member, channel } = interaction;
        const memberPermissions = member.permissions as Permissions;
        if (!memberPermissions.has(command.userPermissions || []))
            return await interaction.reply(
                {
                    content: "You don't have permission to use this command!",
                    ephemeral: true
                });

        if (channel.isText() && !hasPermission(guild.members.me, channel as TextChannel, command.botPermissions || [])) {
            return await interaction.reply(
                {
                    content: `Dont have all ${new Permissions(command.botPermissions).toArray()} permission(s) in ${channel}`,
                    ephemeral: true
                });
        }
    }

    command.run({
        interaction: interaction as ExtendedInteraction
    });
})]