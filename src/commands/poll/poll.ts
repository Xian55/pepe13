import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

const emojiAlphabet = [...'🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿'];
const sep = "+";

export default new Command({
    name: "poll",
    description: "Creates a poll",
    options: [
        {
            name: "question",
            description: "The topic you are interested in.",
            type: "STRING",
            required: true
        },
        {
            name: "choice",
            description: `[Empty 👍👎 or like "one ${sep} two ..."]`,
            type: "STRING",
            required: false
        }
    ],
    run: async ({ interaction, args }) => {

        const question = args.getString("question");
        const choice = args.getString("choice");

        if (choice && choice.indexOf(sep) == -1) {
            const embed = new MessageEmbed().setTitle(`📊 ${question}`);
            await interaction.followUp({ embeds: [embed] }).then(async (msg: Message) => {
                await msg.react('👍');
                await msg.react('👎');
            });
        }
        else {
            const embed = new MessageEmbed().setTitle(`📊 ${question}`);

            const options = choice.split(sep).map(e => e.trim());
            if (options.length > emojiAlphabet.length) {
                return await interaction.followUp(
                    {
                        content: `Exceeded maximum available options (${emojiAlphabet.length})! Please reduce the option count.`,
                        ephemeral: true
                    })
                    .then((reply: Message) => {
                        setTimeout(() => {
                            reply.delete();
                        }, 2000);
                    });
            }

            options.forEach((option, i) => {
                options[i] = `${emojiAlphabet[i]} ${option}`
            });

            embed.setDescription(options.join('\n\n'));

            await interaction.followUp({ embeds: [embed] })
                .then(async (msg: Message) => {
                    options.forEach(async (_, i) => {
                        await msg.react(emojiAlphabet[i]);
                    })
                });

        }
    }
})