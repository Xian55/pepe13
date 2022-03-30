import { Command } from "../../structures/Command";
import "../../utils/array"

const table = [
	":blue_square: It is certain.",
	":blue_square: It is decidedly so",
	":blue_square: Without a doubt",
	":blue_square: Yes, definitely",
	":blue_square: You may rely on it",

	":green_square: As I see it, yes",
	":green_square: Most likely",
	":green_square: Outlook good",
	":green_square: Yes",
	":green_square: Signs point to yes",

	":yellow_square: Reply hazy, try again",
	":yellow_square: Ask again later",
	":yellow_square: Better not tell you now",
	":yellow_square: Cannot predict now",
	":yellow_square: Concentrate and ask again",

	":red_square: Don't count on it",
	":red_square: My reply is no",
	":red_square: My sources say no",
	":red_square: Outlook not so good",
	":red_square: Very doubtful",
];

export default new Command({
	name: '8ball',
	description: 'Get your answer from the magic ball',
	run: async ({ interaction }) => {
		await interaction.reply(table.sample());
	}
})