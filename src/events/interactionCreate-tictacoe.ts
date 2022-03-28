import { GuildMember, Message, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { Event } from "../structures/Events";
import { errorHandler } from "../utils/errorHandler";

export default [new Event('interactionCreate', async (interaction) => {
    if (interaction.isMessageComponent() &&
        interaction.customId.startsWith("ttt")) {
        await updateGrid(interaction);
    }
})]

const updateGrid = async function (interaction: MessageComponentInteraction) {
    const message = interaction.message as Message;

    let xs = 0, os = 0;
    let owner = "";
    let opponent = "";

    const member = interaction.member as GuildMember;
    const { displayName } = member;

    message.components.forEach((actionRow: MessageActionRow, y) => {
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
                content: "Respect others game :pray:. You are not invited to this match!",
                ephemeral: true
            })
    }

    const xs_turn = xs <= os;
    const y = parseInt(interaction.customId[3]);
    const x = parseInt(interaction.customId[4]);

    const buttonPressed = message.components[y].components[x] as MessageButton;

    if (buttonPressed.label !== '_')
        return await interaction.reply({ content: "Someone already moved there!", ephemeral: true });

    if (xs_turn && displayName != owner) {
        return await interaction.reply({ content: `Wait for ${owner} turn!`, ephemeral: true })
    }
    else if (!xs_turn && displayName != opponent) {
        return await interaction.reply({ content: `Wait for ${opponent} turn!`, ephemeral: true })
    }

    buttonPressed.label = xs_turn ? 'X' : 'O';
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

    const styleToNumber = style => style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4;

    buttonPressed.setStyle(styleToNumber(buttonPressed.style));

    await message.edit({ components: message.components });
    await interaction.deferUpdate();
}