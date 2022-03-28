import { MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "tictactoe",
    description: "Initiates a TicTacToe game!",
    options: [
        {
            name: "opponent",
            description: `Who you want to challange!`,
            type: "USER",
            required: true
        },
    ],
    run: async ({ interaction, args }) => {
        const owner = interaction.member;
        const user = args.getUser("opponent");
        const opponent = await interaction.guild.members.fetch({ user: user });

        const components = [
            new MessageActionRow().addComponents(
                new MessageButton({ disabled: true, style: "SUCCESS", label: owner.displayName, customId: "tttowner" }),
                new MessageButton({ disabled: true, style: "SECONDARY", label: "vs", customId: "tttvs" }),
                new MessageButton({ disabled: true, style: "DANGER", label: opponent.displayName, customId: "tttopponent" }),
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
            content: `${owner} challenged ${opponent} in a TicTacToe game!`,
            components: components
        })
    }
})