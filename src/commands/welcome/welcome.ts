import { Command } from "../../structures/Command";
import Schema from "../../schemas/welcome";

export default new Command({
    name: "welcome",
    description: "Plays a welcome clip when you enter voice channel on the server.",
    options: [
        {
            name: "link",
            description: `public youtube link. Note: Keep the clip duration below 10 seconds!`,
            type: "STRING",
            required: false
        },
    ],
    run: async ({ interaction, args }) => {
        const { guild, channel, member } = interaction;
        if (!channel.isText()) return;

        const link = args.getString("link") || "";

        if (link.length == 0) {
            await Schema.findOneAndDelete(
                { Guild: guild.id, Member: member.id }
            );
            interaction.followUp({ content: `Welcome deleted!`, ephemeral: true });
        }
        else {
            await Schema.findOneAndUpdate(
                { Guild: guild.id, Member: member.id },
                { Link: link },
                { new: true, upsert: true }
            );
            interaction.followUp({ content: `Welcome updated to ${link}`, ephemeral: true });
        }
    }
})