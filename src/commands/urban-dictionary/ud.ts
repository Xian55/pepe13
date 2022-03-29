import { Command } from "../../structures/Command";
import { MessageEmbed, MessageAttachment, EmbedAuthorData } from "discord.js"
import UrbanDictionary from 'urban-dictionary';

const defaultOrder = 0;

export default new Command({
    name: 'ud',
    description: 'Search Urban Dictionary',
    options: [
        {
            name: "query",
            description: `search term`,
            type: "STRING" as const,
            required: true,
        },
        {
            name: "order",
            description: `[definition order=${defaultOrder}]`,
            type: "INTEGER" as const,
            required: false,
        }
    ],
    run: async ({ interaction }) => {
        const { options } = interaction;
        const term = options.getString("query");
        UrbanDictionary.define(term, (error: Error, entries) => {
            if (error) {
                console.error(error.message);
                return void interaction.followUp(error.message);
            }

            const order = Math.min(options.getInteger("order"), entries.length - 1) || defaultOrder;
            const entry = entries[order];
            const author: EmbedAuthorData = {
                name: entry.author,
                url: 'https://www.urbandictionary.com/'
            };

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`**[Urban Dictionary] __${term}__ [${(order == 0 ? order + 1 : order)}/${entries.length}]**`)
                .setURL(entry.permalink)
                .setAuthor(author)
                .setDescription(`**Definition**\n${entry.definition}`)
                .addFields({ name: 'Written', value: entry.written_on },
                    { name: ':thumbsup:', value: `\`${entry.thumbs_up}\``, inline: true },
                    { name: ':thumbsdown:', value: `\`${entry.thumbs_down}\``, inline: true }
                )

            let attachments: MessageAttachment[] = [];
            entry.sound_urls.forEach(url => {
                if (["mp3", "wav", "ogg"].includes(url)) {
                    attachments.push(new MessageAttachment('attachment://' + url))
                }
            });

            interaction.followUp({ embeds: [embed], files: attachments });
        })
    }
})