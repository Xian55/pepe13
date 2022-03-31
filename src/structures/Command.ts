import { Permissions, PermissionResolvable } from "discord.js";
import { CommandType } from "../typings/Commands";

export class Command {
    botPermissions: PermissionResolvable[] = [];
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions);
        this.botPermissions.push(Permissions.FLAGS.VIEW_CHANNEL);
    }
}