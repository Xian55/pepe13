import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Events";
import { ExtendedInteraction } from "../typings/Commands";
import { errorHandler } from "../utils/errorHandler";

export default [new Event('interactionCreate', async (interaction: ExtendedInteraction) => {
    const { commandName, isCommand, deferReply, followUp } = interaction;
    if (isCommand()) {
        await deferReply().catch((err) => errorHandler('command', err));
        const command = client.commands.get(commandName)
        if (!command)
            return followUp('You have used a non existing command')

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
})]