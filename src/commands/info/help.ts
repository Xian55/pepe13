import { Command } from "../../structures/Command";

export default new Command({
    name: 'help',
    description: 'Attepmts to send help!',
    run: async ({ interaction }) => {
        await interaction.reply({ content: ":relieved: You are fine!", ephemeral: true });
    }
})