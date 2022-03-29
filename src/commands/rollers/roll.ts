import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

const defaultMin = 1;
const defaultMax = 100;
const dubzUrl = "http://i0.kym-cdn.com/photos/images/original/000/197/503/1320813769830.gif";

export default new Command({
    name: "roll",
    description: "Roll with the dice",
    options: [
        {
            name: "min",
            description: `[min=${defaultMin}]`,
            type: "INTEGER",
            required: false,
        },
        {
            name: "max",
            description: `[max=${defaultMax}]`,
            type: "INTEGER",
            required: false,
        }
    ],
    run: async ({ interaction }) => {
        const { options } = interaction;
        let min = options.getInteger("min") || defaultMin;
        let max = options.getInteger("max") || defaultMax;

        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        let div = (num % 10);

        const dubz = min == defaultMin && max == defaultMax && div > 0 && num / div == 11;

        await interaction.reply({
            content: num.toString(),
            embeds: !dubz ? [] : [
                new MessageEmbed()
                    .setImage(dubzUrl)
                    .setDescription("Dubzz")]
        });
    }
})