import { Command } from "../../structures/Command";
import Schema from "../../schemas/filter";
import { client } from "../..";
import { ApplicationCommandOptionChoice } from "discord.js";

let handlerChoices: ApplicationCommandOptionChoice[] = [];
for (let element of client.chatFilter.filters) {
    let choice = { name: element[0], value: element[0] };
    handlerChoices.push(choice);
}

export default new Command({
    name: "filter",
    description: "A simple chat filter system",
    options: [
        {
            name: "toggle",
            description: "Toggle a chat filtering system.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "Select the channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true,
                },
                {
                    name: "type",
                    description: "Type of filter",
                    type: "STRING",
                    choices: handlerChoices
                }
            ]
        },
        {
            name: "config",
            description: "Add or remove words from the blacklist.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select an option.",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "Add", value: "add"
                        },
                        {
                            name: "Remove", value: "remove"
                        }
                    ]
                },
                {
                    name: "words",
                    description: "Provide the word. Accepts multiple words. (one,two,three)",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    run: async ({ interaction, client }) => {
        const { guild, options } = interaction;
        const handler = options.getString("type") || "default";

        const subCommand = options.getSubcommand();
        switch (subCommand) {
            case "toggle":
                const channelId = options.getChannel("channel").id;

                const exist = await Schema.exists({ Guild: guild.id, Channel: channelId, Handler: handler });
                if (!exist) {
                    await Schema.create(
                        { Guild: guild.id, Channel: channelId, Handler: handler }
                    );

                    client.chatFilter.channels.set(guild.id, channelId);

                    let collection = client.chatFilter.handlers.get(channelId) || [];
                    collection.push(handler);
                    client.chatFilter.handlers.set(channelId, collection);

                    interaction.followUp({
                        content: `Enabled ${handler} filtering on <#${channelId}>.`,
                        ephemeral: true
                    });
                }
                else {
                    await Schema.findOneAndDelete(
                        { Guild: guild.id, Channel: channelId, Handler: handler }
                    );

                    let collection = client.chatFilter.handlers.get(channelId);
                    if (collection) {
                        collection.splice(collection.indexOf(handler), 1);
                        if (collection.length == 0)
                            delete client.chatFilter.channels[guild.id];
                    }

                    interaction.followUp({
                        content: `Disabled ${handler} filtering on <#${channelId}>`,
                        ephemeral: true
                    });
                }

                break;
            case "config":
                const choice = options.getString("options");
                const words = options.getString("words").toLocaleLowerCase().split(",");

                switch (choice) {
                    case "add":
                        Schema.findOne({ Guild: guild.id }, async (err, data) => {
                            if (err) throw err;
                            if (!data) {
                                await Schema.create({ Guild: guild.id, Channel: null, Handler: handler, Words: words });
                                client.chatFilter.words.set(guild.id, words);
                                interaction.followUp({ content: `Added ${words.length} new words(s) to the blacklist.` });
                            }

                            const newWords: string[] = []
                            words.forEach((w) => {
                                if (data.Words.includes(w)) return;
                                newWords.push(w);
                                data.Words.push(w);
                                client.chatFilter.words.get(guild.id).push(w);
                            });

                            interaction.followUp({ content: `Added ${newWords.length} new word(s) to the blacklist` });
                            data.save();
                        });
                        break;
                    case "remove":
                        Schema.findOne({ Guild: guild.id }, async (err, data) => {
                            if (err) throw err;
                            if (!data) {
                                return interaction.followUp({ content: "There is no data to remove." });
                            }

                            const removedWords: string[] = [];
                            words.forEach((w) => {
                                if (!data.Words.incudes(w)) return;
                                data.Words.remove(w);
                                removedWords.push(w);
                            });

                            const newArray = client.chatFilter.words
                                .get(guild.id)
                                .filter((word) => !removedWords.includes(word));

                            client.chatFilter.words.set(guild.id, newArray);

                            interaction.followUp({ content: `Removed ${removedWords.length} word(s) from the blacklist.` });
                        })
                        break;
                }
                break;
        }
    }
})