import { Command } from "../../structures/Command";

export default new Command({
    name: 'help',
    description: 'Attepmts to send help!',
    run: async ({ interaction }) => {
        return interaction.followUp({ content: ":relieved: You are fine!", ephemeral: true });
    }
})