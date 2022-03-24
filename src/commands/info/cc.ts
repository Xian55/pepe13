import { TextChannel } from "discord.js";
import { Command } from "../../structures/Command";

const defaultAmount = 1;

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
        if (!channel.isText()) return;

        const amount = args.getInteger("amount") || defaultAmount;

        const textChannel = channel as TextChannel;
        await textChannel.bulkDelete(amount);
    }
})