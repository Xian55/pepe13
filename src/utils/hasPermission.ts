import { GuildMember, PermissionResolvable, GuildChannelResolvable } from "discord.js"

export const hasPermission =
    (member: GuildMember, channel: GuildChannelResolvable, permissions: PermissionResolvable[]): boolean => {
        return channel && member.permissionsIn(channel).has(permissions);
    };