import { AnyChannel, ApplicationCommandDataResolvable, Client, ClientEvents, Collection, TextBasedChannel } from "discord.js";
import { CommandType } from "../typings/Commands";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Events";
import { logHandler } from "../utils/logHandler";
import { errorHandler } from "../utils/errorHandler";
import { ChatFilter } from "../typings/ChatFilter";
import initChatFilter from "../systems/chatfilter/chatFilter"
import { Player } from "discord-player";

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    chatFilter: ChatFilter = new ChatFilter();
    player: Player;

    constructor() {
        super({ intents: 32767 })

        this.player = new Player(this, {
            ytdlOptions: {
                begin: 0,
                filter: 'audioonly'
            }
        });
        this.player.on("error", (queue, error) => {
            errorHandler(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`, error);
        });
        this.player.on("connectionError", (queue, error) => {
            errorHandler(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`, error);
        });

        if (process.env.environment == "debug" || process.env.environment == "dev") {
            this.player.on("debug", (queue, message) => {
                logHandler.log("debug", `[${queue.guild.name}] ${message}`);
            });
        }

        this.player.on("trackStart", (queue, track) => {
            const channel = queue.metadata as AnyChannel;
            if (channel.isVoice()) {
                logHandler.log("debug", `🎶 | Playing: ${track.title} in ${queue.connection.channel.name}!`);
                return;
            }
            const textChannel = queue.metadata as TextBasedChannel;
            textChannel.send(`🎶 | Playing: \`${track.title}\` in **${queue.connection.channel.name}**!`);
        });

        this.player.on("trackAdd", (queue, track) => {
            if (track.author == 'file:\\' || queue.tracks.length == 1) return;

            const channel = queue.metadata as AnyChannel;
            if (channel.isVoice()) {
                console.log(`🎶 | Queued: ${track.title} Track!`);
                return;
            }
            const textChannel = queue.metadata as TextBasedChannel;
            textChannel.send(`🎶 | Queued: \`${track.title}\` Track!`);
        });

        this.player.on("botDisconnect", (queue) => {
            const channel = queue.metadata as AnyChannel;
            if (channel.isVoice()) {
                console.log("❌ | I was manually disconnected from the voice channel, clearing queue!");
                return;
            }
            const textChannel = queue.metadata as TextBasedChannel;
            textChannel.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
        });

        this.player.on("channelEmpty", (queue) => {
            const channel = queue.metadata as AnyChannel;
            if (channel.isVoice()) return;
            const textChannel = queue.metadata as TextBasedChannel;
            textChannel.send("❌ | Nobody is in the voice channel, leaving...");
        });

        this.player.on("queueEnd", (queue) => {
            return;
            const channel = queue.metadata as AnyChannel;
            if (channel.isVoice()) return;
            const textChannel = queue.metadata as TextBasedChannel;
            textChannel.send("✅ | Queue finished!");
        });
    }

    async start() {
        await initChatFilter(this);

        const deploy = process.env.deploy.toLowerCase() === 'true';
        const clean = process.env.clean.toLowerCase() === 'true';

        if (deploy)
            this.manageModules(clean);

        this.login(process.env.botToken)
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands(clean: boolean, { commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            logHandler.log("info", `${clean ? "Removed" : `Registered ${commands.length}`} commands at ${guildId}`);
        }
        else {
            this.application.commands.set(commands);
            logHandler.log("info", `${clean ? "Removed" : `Registered ${commands.length}`} global commands`);
        }
    }

    async manageModules(clean: boolean) {
        const slashCommands: ApplicationCommandDataResolvable[] = [];

        if (!clean) {
            const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
            //console.log({commandFiles});

            commandFiles.forEach(async filePath => {
                const command: CommandType = await this.importFile(filePath);
                if (!command.name) return;
                //console.log(command);

                // only for guild based permissions
                //if (command.userPermissions)
                //    command.defaultPermission = false;

                this.commands.set(command.name, command);
                slashCommands.push(command);
            });
        }

        this.on("ready", () => {
            this.registerCommands(clean, {
                commands: slashCommands,
                guildId: process.env.guildId
            });
        });

        // Event
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

        eventFiles.forEach(async filePath => {
            const events: Event<keyof ClientEvents>[] = await this.importFile(filePath)
            try {
                for (const event of events)
                    this.on(event.event, event.run)
            }
            catch (e) {
                console.error(filePath, e);
            }
        })
    }

}