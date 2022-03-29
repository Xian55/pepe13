import { GuildMember, Message, MessageButton } from "discord.js";
import { Event } from "../structures/Events";
import { errorHandler } from "../utils/errorHandler";

export default [new Event('interactionCreate', async (interaction) => {
    if (!interaction.isMessageComponent()) return;

    const { customId } = interaction;
    if (!customId.startsWith("ttt")) return;

    const { message, member } = <{ message: Message, member: GuildMember }>interaction;
    const { displayName } = member;

    let xs = 0, os = 0;
    let owner = "";
    let opponent = "";

    const { components } = message;

    components.forEach((actionRow, y) => {
        actionRow.components.forEach((button: MessageButton) => {
            const { customId, label } = button;
            // header
            if (y == 0) {
                if (customId.includes("tttowner")) {
                    owner = label;
                } else if (customId.includes("tttopponent")) {
                    opponent = label;
                }
            }

            if (label === 'X') xs++;
            else if (label === 'O') os++;
        });
    });

    if (![owner, opponent].includes(displayName)) {
        return await interaction.reply(
            {
                content: "Respect others game :pray:. You're not invited!",
                ephemeral: true
            })
    }

    const xs_turn = xs <= os;
    const y = parseInt(customId[3]); // tttyx
    const x = parseInt(customId[4]); // tttyx
    const buttonPressed = components[y].components[x] as MessageButton;

    if (buttonPressed.label !== '_')
        return await interaction.reply({ content: "Somebody already moved there :eyes:!", ephemeral: true });

    if (xs_turn && displayName != owner)
        return await interaction.reply({ content: `Wait for ${owner} turn :timer:!`, ephemeral: true })
    else if (!xs_turn && displayName != opponent)
        return await interaction.reply({ content: `Wait for ${opponent} turn :timer:!`, ephemeral: true })

    buttonPressed.label = xs_turn ? 'X' : 'O';
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

    await message.edit({ components: components });
    await interaction.deferUpdate();
})]