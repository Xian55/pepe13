import { ChatInputApplicationCommandData, CommandInteraction, GuildMember, PermissionResolvable } from "discord.js"

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

interface CommandTypeRunOptions {
    interaction: ExtendedInteraction
}

type CommandTypeRunFunction = (options: CommandTypeRunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    run: CommandTypeRunFunction;
} & ChatInputApplicationCommandData