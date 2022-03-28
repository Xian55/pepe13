import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../typings/Commands";
import { errorHandler } from "../utils/errorHandler";

export default [new Event('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    await interaction.deferReply().catch((err) => errorHandler('interactionCreate', err));
    const command = client.commands.get(interaction.commandName)
    if (!command)
        return interaction.followUp('You have used a non existing command')

    command.run({
        args: interaction.options as CommandInteractionOptionResolver,
        client,
        interaction: interaction as ExtendedInteraction
    });
})]