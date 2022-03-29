import { client } from "..";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../typings/Commands";
import { errorHandler } from "../utils/errorHandler";

const { commands } = client;

export default [new Event('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName)
    if (!command)
        return await interaction.reply({ content: "You have used a non existing command", ephemeral: true });

    command.run({
        interaction: interaction as ExtendedInteraction
    });
})]