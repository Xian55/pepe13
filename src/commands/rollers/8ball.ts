import { Command } from "../../structures/Command";
import "../../utils/array"

const table = [
	"It is certain",
	"It is decidedly so",
	"Without a doubt",
	"Yes, definitely",
	"You may rely on it",
	"As I see it, yes",
	"Most likely",
	"Outlook good",
	"Yes",
	"Signs point to yes",
	"Reply hazy try again",
	"Ask again later",
	"Better not tell you now",
	"Cannot predict now",
	"Concentrate and ask again",
	"Don't count on it",
	"My reply is no",
	"My sources say no",
	"Outlook not so good",
	"Very doubtful",
];

export default new Command({
    name: '8ball',
    description: 'Get your answer from the magic ball',
    run: async({interaction}) => {
		interaction.followUp(table.sample());
    } 
})