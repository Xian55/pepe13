import { client } from "..";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../typings/Commands";
import { errorHandler } from "../utils/errorHandler";

const { commands } = client;

export default [new Event('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    await interaction.deferReply().catch((err) => errorHandler('interactionCreate-commands', err));
    const command = commands.get(interaction.commandName)
    if (!command)
        return interaction.followUp('You have used a non existing command')

    command.run({
        interaction: interaction as ExtendedInteraction
    });
})]