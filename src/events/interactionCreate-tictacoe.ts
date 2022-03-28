import { GuildManager, GuildMember, Message, MessageActionRow, MessageActionRowComponent, MessageButton, MessageComponentInteraction } from "discord.js";
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

    message.components.forEach((actionRow: MessageActionRow, i) => {
        actionRow.components.forEach((button: MessageButton) => {
            // header
            if (i == 0) {
                if (button.customId.includes("tttowner")) {
                    owner = button.label;
                } else if (button.customId.includes("tttopponent")) {
                    opponent = button.label;
                }
            }

            if (button.label === 'X') xs++;
            else if (button.label === 'O') os++;
        });
    });

    if (![owner, opponent].includes(displayName)) {
        return await interaction.reply({ content: "You can't play this game!", ephemeral: true })
    }

    const xs_turn = xs <= os;

    if (xs_turn && displayName != owner) {
        return await interaction.reply({ content: `Wait for ${owner} turn!`, ephemeral: true })
    }
    else if (!xs_turn && displayName != opponent) {
        return await interaction.reply({ content: `Wait for ${opponent} turn!`, ephemeral: true })
    }

    const i = parseInt(interaction.customId[3]),
        j = parseInt(interaction.customId[4]);

    const buttonPressed = message.components[i].components[j] as MessageButton;

    if (buttonPressed.label !== '_')
        return await interaction.reply({ content: "Someone already played there!", ephemeral: true });

    buttonPressed.label = xs_turn ? 'X' : 'O';
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

    const styleToNumber = style => style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4;

    const components = [];
    message.components.forEach((actionRow: MessageActionRow, i) => {
        // header
        if (i == 0) {
            components.push(message.components[0]);
            return;
        }
        // board
        components.push({ type: 1, components: [] });
        actionRow.components.forEach((button: MessageButton) => {
            components[components.length - 1].components.push(
                {
                    type: 2,
                    label: button.label,
                    style: styleToNumber(button.style),
                    custom_id: button.customId
                }
            );
        });
    });

    await message.edit({ components: components });
    await interaction.deferUpdate();
}