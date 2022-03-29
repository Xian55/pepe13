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
    run: async ({ interaction }) => {

        const { options } = interaction;

        const question = options.getString("question");
        const raw_choices = options.getString("choices");

        if (!raw_choices || raw_choices.indexOf(sep) == -1) {
            const embed = new MessageEmbed().setTitle(`📊 ${question}`);
            await interaction.reply({ embeds: [embed] });
            const reply = await interaction.fetchReply() as Message;
            await reply.react('👍');
            await reply.react('👎');
            return;
        }

        const choices = raw_choices.split(sep).map(e => e.trim());
        if (choices.length > emojiAlphabet.length) {
            return await interaction.reply(
                {
                    content: `Exceeded maximum available choices (${choices.length})!` +
                        ` Please reduce the choice count (${choices.length} < ${emojiAlphabet.length}) .`,
                    ephemeral: true
                });
        }

        choices.forEach((choice, i) => {
            choices[i] = `${emojiAlphabet[i]} ${choice}`
        });

        const embed = new MessageEmbed()
            .setTitle(`📊 ${question}`)
            .setDescription(choices.join('\n\n'));

        await interaction.reply({ embeds: [embed] })
        const reply = await interaction.fetchReply() as Message;
        choices.forEach(async (_, i) => {
            await reply.react(emojiAlphabet[i]);
        });
    }
})