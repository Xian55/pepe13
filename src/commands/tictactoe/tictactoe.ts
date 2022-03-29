import { MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "tictactoe",
    description: "Initiates a Tic-tac-toe game!",
    options: [
        {
            name: "opponent",
            description: "Who's your opponent?",
            type: "USER",
            required: true
        },
        {
            name: "opponent_starts",
            description: "The oppontent should start the game?",
            type: "BOOLEAN",
            required: false
        }
    ],
    run: async ({ interaction }) => {
        const { options, member, guild } = interaction;
        const opponent = await guild.members
            .fetch({ user: options.getUser("opponent") });

        let first = member.displayName;
        let second = opponent.displayName;
        const opponent_starts = options.getBoolean("opponent_starts") || false;
        if (opponent_starts) {
            first = opponent.displayName;
            second = member.displayName;
        }

        const components = [
            new MessageActionRow().addComponents(
                new MessageButton({
                    disabled: true, style: "SUCCESS",
                    label: first,
                    customId: "tttowner"
                }),
                new MessageButton({
                    disabled: true, style: "SECONDARY",
                    label: "vs", customId: "tttvs"
                }),
                new MessageButton({
                    disabled: true, style: "DANGER",
                    label: second,
                    customId: "tttopponent"
                }),
            ),
            new MessageActionRow().addComponents(
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt10" }),
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt11" }),
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt12" }),
            ),
            new MessageActionRow().addComponents(
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt20" }),
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt21" }),
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt22" }),
            ),
            new MessageActionRow().addComponents(
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt30" }),
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt31" }),
                new MessageButton({ label: "_", style: "SECONDARY", customId: "ttt32" }),
            )
        ];

        interaction.editReply({
            content: `${member} challenged ${opponent} in a Tic-tac-toe game! ${opponent_starts ? `\nMake the first move, ${first}` : ""}`,
            components: components
        })
    }
})