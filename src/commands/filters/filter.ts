import { Command } from "../../structures/Command";
import filter from "../../schemas/filter";

export default new Command({
    name: "filter",
    description: "A simple chat filter system",
    options: [
        {
            name: "settings",
            description: "A simple chat filtering system.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "logging",
                    description: "Select the loggings channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
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

        const subCommand = options.getSubcommand();
        switch (subCommand) {
            case "settings":
                const channelId = options.getChannel("logging").id;

                await filter.findOneAndUpdate(
                    { Guild: guild.id },
                    { Log: channelId },
                    { new: true, upsert: true }
                );

                client.filtersLog.set(guild.id, channelId);

                interaction.followUp({
                    content: `Added <#${channelId} as the logging channel for the filtering system.`,
                    ephemeral: true
                });
                break;
            case "config":
                const choice = options.getString("options");
                const words = options.getString("words").toLocaleLowerCase().split(",");

                switch (choice) {
                    case "add":
                        filter.findOne({ Guild: guild.id }, async (err, data) => {
                            if (err) throw err;
                            if (!data) {
                                await filter.create({ Guild: guild.id, Log: null, Words: words });
                                client.filters.set(guild.id, words);
                                interaction.followUp({ content: `Added ${words.length} new words(s) to the blacklist.` });
                            }

                            const newWords: string[] = []
                            words.forEach((w) => {
                                if (data.Words.includes(w)) return;
                                newWords.push(w);
                                data.Words.push(w);
                                client.filters.get(guild.id).push(w);
                            });

                            interaction.followUp({ content: `Added ${newWords.length} new word(s) to the blacklist` });
                            data.save();
                        });
                        break;
                    case "remove":
                        filter.findOne({ Guild: guild.id }, async (err, data) => {
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

                            const newArray = client.filters
                                .get(guild.id)
                                .filter((word) => !removedWords.includes(word));

                            client.filters.set(guild.id, newArray);

                            interaction.followUp({ content: `Removed ${removedWords.length} word(s) from the blacklist.` });
                        })
                        break;
                }

                break;
        }
    }
})