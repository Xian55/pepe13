import { TextChannel } from "discord.js";
import { Command } from "../../structures/Command";

const defaultAmount = 2;

export default new Command({
    name: "cc",
    description: "Clears messages",
    options: [
        {
            name: "amount",
            description: `[amount=${defaultAmount}]`,
            type: "INTEGER",
            required: false
        },
    ],
    run: async ({ interaction, args }) => {
        const { channel } = interaction;

        if (!channel.isText())
            return;

        const amount = Math.min(args.getInteger("amount"), 100) || defaultAmount;

        const textChannel = channel as TextChannel;
        await textChannel.bulkDelete(amount);
    }
})