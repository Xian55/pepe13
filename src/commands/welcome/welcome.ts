import { Command } from "../../structures/Command";
import Schema from "../../schemas/welcome";

export default new Command({
    name: "welcome",
    description: "Sets a welcome audio.",
    options: [
        {
            name: "link",
            description: `Enter a youtube link!`,
            type: "STRING",
            required: false
        },
    ],
    run: async ({ interaction, args }) => {
        const { guild, channel, member, followUp } = interaction;
        if (!channel.isText()) return;

        const link = args.getString("link") || "";

        if (link.length == 0) {
            await Schema.findOneAndDelete(
                { Guild: guild.id, Member: member.id }
            );
            followUp({ content: `Welcome deleted!` });
        }
        else {
            await Schema.findOneAndUpdate(
                { Guild: guild.id, Member: member.id },
                { Link: link },
                { new: true, upsert: true }
            );
            followUp({ content: `Welcome updated to ${link}` });
        }
    }
})