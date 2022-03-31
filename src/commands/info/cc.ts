import { Permissions, TextChannel } from "discord.js";
import { Command } from "../../structures/Command";

const defaultAmount = 1;

export default new Command({
    name: "cc",
    description: "Clears messages",
    userPermissions: [
        Permissions.FLAGS.MANAGE_MESSAGES
    ],
    botPermissions: [
        Permissions.FLAGS.MANAGE_MESSAGES
    ],
    options: [
        {
            name: "amount",
            description: `[amount=${defaultAmount}]`,
            type: "INTEGER",
            required: false
        },
    ],
    run: async ({ interaction }) => {
        const { channel, options } = interaction;
        const amount = Math.min(options.getInteger("amount"), 100) || defaultAmount;

        const textChannel = channel as TextChannel;
        const removed = await textChannel.bulkDelete(amount);

        await interaction.reply({ content: `Removed **${removed.size}** message(s).`, ephemeral: true });
    }
})