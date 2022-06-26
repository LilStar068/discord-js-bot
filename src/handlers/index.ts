import { registerCommands } from "./registerCommands";
import { getFiles } from "../utils";
import { DiscordClientJS } from "../builders/client";
import { join } from "path";

export const handleRegisters = async (
    client: DiscordClientJS,
    dir: string,
    suffix: string
) => {
    const commands: any[] = [];
    
    const contextFiles: any[] = getFiles(join(dir, "contexts"), suffix);
    const commandFiles: any[] = getFiles(join(dir, "commands"), suffix);
    const eventFiles: any[] = getFiles(join(dir, "events"), suffix);

    
    contextFiles.forEach((file) => {
        const command = require(file);
        
        commands.push(command.default.command.toJSON());
        client.commands.set(command.default.command.name, command);
    });

    commandFiles.forEach((file) => {
        const command = require(file);

        if (command.default.userPermissions) file.default.defaultPermissions = false;
        commands.push(command.default.command.toJSON());
        client.commands.set(command.default.command.name, command);
    });

    eventFiles.forEach((file: any) => {
        const event = require(file);

        client.events.set(event.default.name, event.default.run);

        if (event.default.once) {
            client.once(event.default.name, async (...args) => {
                await event.default.run(...args, commands);
            });
        } else {
            client.on(event.default.name, async (...args) => {
                await event.default.run(...args, commands);
            });
        }
    });

    await registerCommands(commands, false);
};
