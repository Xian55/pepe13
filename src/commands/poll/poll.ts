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
            name: "choices",
            description: `Separator ${sep} like => one ${sep} two ${sep} three ...`,
            type: "STRING",
            required: false
        }
    ],
    run: async ({ interaction, args }) => {

        const question = args.getString("question");
        const choices = args.getString("choices");

        if (!choices || choices.indexOf(sep) == -1) {
            const embed = new MessageEmbed().setTitle(`📊 ${question}`);
            await interaction.followUp({ embeds: [embed] }).then(async (msg: Message) => {
                await msg.react('👍');
                await msg.react('👎');
            });
        }
        else {
            const options = choices.split(sep).map(e => e.trim());
            if (options.length > emojiAlphabet.length) {
                return await interaction.followUp(
                    {
                        content: `Exceeded maximum available choices (${options.length})! Please reduce the choice count (${options.length} < ${emojiAlphabet.length}) .`,
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

            const embed = new MessageEmbed()
                .setTitle(`📊 ${question}`)
                .setDescription(options.join('\n\n'));

            await interaction.followUp({ embeds: [embed] })
                .then(async (msg: Message) => {
                    options.forEach(async (_, i) => {
                        await msg.react(emojiAlphabet[i]);
                    })
                });
        }
    }
})